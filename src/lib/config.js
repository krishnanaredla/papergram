const env = import.meta.env

export const config = {
    phone: env.VITE_PHONE || '+919XXXXXXXXX',
    phoneDisplay: env.VITE_PHONE_DISPLAY || '+91 9XXX XXX XXX',
    email: env.VITE_EMAIL || 'hello@papergram.in',
    whatsapp: env.VITE_WHATSAPP || '919XXXXXXXXX',
    location: env.VITE_LOCATION || 'Hyderabad, Telangana',
    hours: env.VITE_HOURS || 'Mon – Sat, 9 AM – 7 PM',

    stats: {
        partners: Number(env.VITE_STAT_PARTNERS) || 500,
        units: Number(env.VITE_STAT_UNITS) || 50,
        products: Number(env.VITE_STAT_PRODUCTS) || 5,
        delivery: Number(env.VITE_STAT_DELIVERY) || 24,
    },

    instagramUrl: env.VITE_INSTAGRAM_URL || '',
    linkedinUrl: env.VITE_LINKEDIN_URL || '',
}
