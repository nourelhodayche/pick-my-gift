const prisma = require('../lib/prisma')
const mql = require('@microlink/mql')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())



const cleanPrice = (price) => {
  if (!price) return null

  // Supprimer espaces, newlines, caractères invisibles
  let cleaned = price.replace(/\s+/g, ' ').trim()

  // Extraire le premier nombre valide (ex: "5094.000001" → "5094", "12\n." → "12")
  const match = cleaned.match(/[\d\s]+[.,]?\d*/)?.[0]
  if (!match) return cleaned

  // Convertir en nombre propre
  const num = parseFloat(match.replace(/\s/g, '').replace(',', '.'))
  if (isNaN(num)) return cleaned

  // Afficher sans décimales inutiles
  return Math.round(num).toString()
}

const scrapeProduct = async (req, res) => {
  const { url } = req.body

  if (!url) {
    return res.status(400).json({ message: 'URL is required' })
  }

  // Puppeteer en premier
  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36')
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })

    const data = await page.evaluate(() => {
      const getMeta = (name) => {
        const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
        return el ? el.getAttribute('content') : null
      }

      return {
        title: getMeta('og:title') || document.title,
        image: getMeta('og:image') || document.querySelector('img')?.src,
        price: getMeta('product:price:amount') || document.querySelector('[class*="price"]')?.innerText?.trim()
      }
    })

    return res.json({
      title: data.title,
      image: data.image,
      price: cleanPrice(data.price),
      url
    })
  } catch (puppeteerError) {
    // Fallback Microlink
    try {
      const { data } = await mql(url, {
        data: {
          title: { selector: '#productTitle', type: 'text' },
          image: { selector: '#landingImage', attr: 'src' },
          price: { selector: '.a-price-whole', type: 'text' }
        }
      })

      return res.json({
        title: data.title || data.ogTitle,
        image: data.image?.url || data.ogImage,
        price: cleanPrice(data.price),
        url
      })
    } catch (mlError) {
      return res.status(500).json({ message: 'Scraping failed', error: mlError.message })
    }
  } finally {
    if (browser) await browser.close()
  }
}

const addGift = async (req, res) => {
  try {
    const { name, image, price, url } = req.body
    const eventId = parseInt(req.params.eventId)

    if (!name) {
      return res.status(400).json({ message: 'Gift name is required' })
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } })

    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (event.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const gift = await prisma.gift.create({
      data: { name, image, price, url, eventId }
    })

    res.status(201).json(gift)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const getEventGifts = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId)

    const gifts = await prisma.gift.findMany({
      where: { eventId },
      include: {
        reservation: {
          include: { user: { select: { id: true, name: true } } }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    res.json(gifts)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

const deleteGift = async (req, res) => {
  try {
    const gift = await prisma.gift.findUnique({
      where: { id: parseInt(req.params.giftId) },
      include: { event: true }
    })

    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' })
    }

    if (gift.event.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.gift.delete({ where: { id: parseInt(req.params.giftId) } })

    res.json({ message: 'Gift deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { scrapeProduct, addGift, getEventGifts, deleteGift }