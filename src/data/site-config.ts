export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://Harol-Reina.github.io',
    title: 'Harol Reina',
    subtitle: 'DevOps Engineer & Backend Developer',
    description: '¡Bienvenido a mi sitio web! Soy Harol Reina, un ingeniero DevOps especializado en desarrollo backend con .NET, Python y Node.js. Aquí comparto tips, tutoriales y mejores prácticas sobre Linux, DevOps, CI/CD, desarrollo backend y automatización. Explora mis proyectos y conocimientos técnicos.',
    image: {
        src: '/dante-preview.jpg',
        alt: 'Dante - Astro.js and Tailwind CSS theme'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Projects',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Currículum',
            href: '/resume'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: '/about'
        },
        {
            text: 'Contact',
            href: '/contact'
        },
        {
            text: 'Terms',
            href: '/terms'
        },
        {
            text: 'Download theme',
            href: 'https://github.com/JustGoodUI/dante-astro-theme'
        }
    ],
    socialLinks: [
        {
            text: 'GitHub',
            href: 'https://github.com/Harol-Reina'
        },
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/harol-alfonso-reina-herrera-53199b34'
        },
        {
            text: 'X/Twitter',
            href: 'https://x.com/HaroldR1975'
        }
    ],
    hero: {
        title: '¡Hola! Bienvenido a mi espacio técnico',
        text: "Soy **Harol Reina**, un ingeniero DevOps con amplia experiencia en desarrollo backend utilizando **.NET** y **Python**. Mi pasión es automatizar procesos, optimizar infraestructuras y compartir conocimiento técnico. En este sitio encontrarás tips, tutoriales y mejores prácticas sobre **Linux**, **DevOps**, **CI/CD**, desarrollo backend y automatización. Conéctate conmigo en <a href='https://github.com/Harol-Reina'>GitHub</a> para ver mis proyectos o sígueme en mis redes sociales.",
        image: {
            src: '/hero.jpeg',
            alt: 'DevOps Engineer trabajando en infraestructura y desarrollo'
        },
        actions: [
            {
                text: 'Ver mis proyectos',
                href: '/projects'
            },
            {
                text: 'Contacto',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        title: 'Suscríbete a mis actualizaciones técnicas',
        text: 'Recibe los últimos tips sobre DevOps, Linux, CI/CD y desarrollo backend directamente en tu correo.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
