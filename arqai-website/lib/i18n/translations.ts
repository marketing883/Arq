export type Locale = "en" | "es" | "fr" | "de" | "ja";

export const SUPPORTED_LOCALES: Locale[] = ["en", "es", "fr", "de", "ja"];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  ja: "🇯🇵",
};

// Core translations for the website
export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.platform": "Platform",
    "nav.solutions": "Solutions",
    "nav.demo": "Request Demo",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",

    // Hero Section
    "hero.tagline": "The Command Platform for Enterprise AI",
    "hero.title.line1": "Intelligence,",
    "hero.title.line2": "By Design",
    "hero.description": "Move from high-risk AI chaos to a secure, compliant, and fully governed AI workforce. ArqAI is the industry's first integrated command platform for enterprise AI governance.",
    "hero.cta.primary": "Request Demo",
    "hero.cta.secondary": "Explore Platform",

    // Problem Section
    "problem.title": "The Enterprise AI Crisis",
    "problem.subtitle": "Organizations are deploying AI without the governance framework to manage risk",
    "problem.stat1.value": "73%",
    "problem.stat1.label": "of enterprises lack AI governance",
    "problem.stat2.value": "$4.2M",
    "problem.stat2.label": "average cost of AI compliance failure",
    "problem.stat3.value": "89%",
    "problem.stat3.label": "report shadow AI concerns",

    // Solution Section
    "solution.title": "One Platform. Complete Control.",
    "solution.subtitle": "ArqAI brings together everything you need to deploy AI safely at enterprise scale",
    "solution.governance.title": "Governance",
    "solution.governance.description": "Complete visibility and control over every AI agent in your organization",
    "solution.security.title": "Security",
    "solution.security.description": "Enterprise-grade security with SOC 2, HIPAA, and GDPR compliance built-in",
    "solution.orchestration.title": "Orchestration",
    "solution.orchestration.description": "Deploy, manage, and scale AI agents across your entire infrastructure",

    // CTA Section
    "cta.title": "Ready to take command of your AI?",
    "cta.subtitle": "Join leading enterprises who trust ArqAI to govern their AI workforce.",
    "cta.button": "Schedule Demo",

    // Footer
    "footer.company": "Company",
    "footer.about": "About Us",
    "footer.careers": "Careers",
    "footer.press": "Press",
    "footer.resources": "Resources",
    "footer.blog": "Blog",
    "footer.documentation": "Documentation",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "© 2025 ArqAI. All rights reserved.",

    // Chat Widget
    "chat.greeting": "Hi! I'm the ArqAI assistant. How can I help you today?",
    "chat.placeholder": "Ask me anything about ArqAI...",
    "chat.send": "Send",

    // Cookie Consent
    "cookies.title": "We value your privacy",
    "cookies.description": "We use cookies to enhance your experience, analyze site traffic, and personalize content.",
    "cookies.acceptAll": "Accept All",
    "cookies.rejectAll": "Reject All",
    "cookies.customize": "Customize",
    "cookies.necessary": "Necessary",
    "cookies.analytics": "Analytics",
    "cookies.marketing": "Marketing",
    "cookies.preferences": "Preferences",
    "cookies.save": "Save Preferences",
    "cookies.learnMore": "Learn more",
  },

  es: {
    // Navigation
    "nav.platform": "Plataforma",
    "nav.solutions": "Soluciones",
    "nav.demo": "Solicitar Demo",
    "nav.pricing": "Precios",
    "nav.contact": "Contacto",

    // Hero Section
    "hero.tagline": "La Plataforma de Comando para IA Empresarial",
    "hero.title.line1": "Inteligencia,",
    "hero.title.line2": "Por Diseño",
    "hero.description": "Pase del caos de IA de alto riesgo a una fuerza laboral de IA segura, conforme y completamente gobernada. ArqAI es la primera plataforma integrada de comando para gobernanza de IA empresarial.",
    "hero.cta.primary": "Solicitar Demo",
    "hero.cta.secondary": "Explorar Plataforma",

    // Problem Section
    "problem.title": "La Crisis de IA Empresarial",
    "problem.subtitle": "Las organizaciones están implementando IA sin el marco de gobernanza para gestionar el riesgo",
    "problem.stat1.value": "73%",
    "problem.stat1.label": "de empresas carecen de gobernanza de IA",
    "problem.stat2.value": "$4.2M",
    "problem.stat2.label": "costo promedio de falla de cumplimiento de IA",
    "problem.stat3.value": "89%",
    "problem.stat3.label": "reportan preocupaciones de IA en la sombra",

    // Solution Section
    "solution.title": "Una Plataforma. Control Completo.",
    "solution.subtitle": "ArqAI reúne todo lo que necesita para implementar IA de forma segura a escala empresarial",
    "solution.governance.title": "Gobernanza",
    "solution.governance.description": "Visibilidad y control completos sobre cada agente de IA en su organización",
    "solution.security.title": "Seguridad",
    "solution.security.description": "Seguridad de nivel empresarial con cumplimiento de SOC 2, HIPAA y GDPR integrado",
    "solution.orchestration.title": "Orquestación",
    "solution.orchestration.description": "Implemente, gestione y escale agentes de IA en toda su infraestructura",

    // CTA Section
    "cta.title": "¿Listo para tomar el control de su IA?",
    "cta.subtitle": "Únase a las empresas líderes que confían en ArqAI para gobernar su fuerza laboral de IA.",
    "cta.button": "Programar Demo",

    // Footer
    "footer.company": "Empresa",
    "footer.about": "Sobre Nosotros",
    "footer.careers": "Carreras",
    "footer.press": "Prensa",
    "footer.resources": "Recursos",
    "footer.blog": "Blog",
    "footer.documentation": "Documentación",
    "footer.legal": "Legal",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Servicio",
    "footer.copyright": "© 2025 ArqAI. Todos los derechos reservados.",

    // Chat Widget
    "chat.greeting": "¡Hola! Soy el asistente de ArqAI. ¿Cómo puedo ayudarte hoy?",
    "chat.placeholder": "Pregúntame cualquier cosa sobre ArqAI...",
    "chat.send": "Enviar",

    // Cookie Consent
    "cookies.title": "Valoramos su privacidad",
    "cookies.description": "Utilizamos cookies para mejorar su experiencia, analizar el tráfico del sitio y personalizar el contenido.",
    "cookies.acceptAll": "Aceptar Todo",
    "cookies.rejectAll": "Rechazar Todo",
    "cookies.customize": "Personalizar",
    "cookies.necessary": "Necesarias",
    "cookies.analytics": "Analíticas",
    "cookies.marketing": "Marketing",
    "cookies.preferences": "Preferencias",
    "cookies.save": "Guardar Preferencias",
    "cookies.learnMore": "Saber más",
  },

  fr: {
    // Navigation
    "nav.platform": "Plateforme",
    "nav.solutions": "Solutions",
    "nav.demo": "Demander une Démo",
    "nav.pricing": "Tarifs",
    "nav.contact": "Contact",

    // Hero Section
    "hero.tagline": "La Plateforme de Commande pour l'IA d'Entreprise",
    "hero.title.line1": "Intelligence,",
    "hero.title.line2": "Par Conception",
    "hero.description": "Passez du chaos de l'IA à haut risque à une main-d'œuvre IA sécurisée, conforme et entièrement gouvernée. ArqAI est la première plateforme intégrée de commande pour la gouvernance de l'IA d'entreprise.",
    "hero.cta.primary": "Demander une Démo",
    "hero.cta.secondary": "Explorer la Plateforme",

    // Problem Section
    "problem.title": "La Crise de l'IA d'Entreprise",
    "problem.subtitle": "Les organisations déploient l'IA sans cadre de gouvernance pour gérer les risques",
    "problem.stat1.value": "73%",
    "problem.stat1.label": "des entreprises manquent de gouvernance IA",
    "problem.stat2.value": "4,2M$",
    "problem.stat2.label": "coût moyen d'échec de conformité IA",
    "problem.stat3.value": "89%",
    "problem.stat3.label": "signalent des préoccupations sur l'IA fantôme",

    // Solution Section
    "solution.title": "Une Plateforme. Contrôle Complet.",
    "solution.subtitle": "ArqAI rassemble tout ce dont vous avez besoin pour déployer l'IA en toute sécurité à l'échelle de l'entreprise",
    "solution.governance.title": "Gouvernance",
    "solution.governance.description": "Visibilité et contrôle complets sur chaque agent IA de votre organisation",
    "solution.security.title": "Sécurité",
    "solution.security.description": "Sécurité de niveau entreprise avec conformité SOC 2, HIPAA et RGPD intégrée",
    "solution.orchestration.title": "Orchestration",
    "solution.orchestration.description": "Déployez, gérez et mettez à l'échelle les agents IA sur toute votre infrastructure",

    // CTA Section
    "cta.title": "Prêt à prendre le contrôle de votre IA?",
    "cta.subtitle": "Rejoignez les entreprises leaders qui font confiance à ArqAI pour gouverner leur main-d'œuvre IA.",
    "cta.button": "Planifier une Démo",

    // Footer
    "footer.company": "Entreprise",
    "footer.about": "À Propos",
    "footer.careers": "Carrières",
    "footer.press": "Presse",
    "footer.resources": "Ressources",
    "footer.blog": "Blog",
    "footer.documentation": "Documentation",
    "footer.legal": "Légal",
    "footer.privacy": "Politique de Confidentialité",
    "footer.terms": "Conditions d'Utilisation",
    "footer.copyright": "© 2025 ArqAI. Tous droits réservés.",

    // Chat Widget
    "chat.greeting": "Bonjour! Je suis l'assistant ArqAI. Comment puis-je vous aider aujourd'hui?",
    "chat.placeholder": "Posez-moi n'importe quelle question sur ArqAI...",
    "chat.send": "Envoyer",

    // Cookie Consent
    "cookies.title": "Nous valorisons votre vie privée",
    "cookies.description": "Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic du site et personnaliser le contenu.",
    "cookies.acceptAll": "Tout Accepter",
    "cookies.rejectAll": "Tout Refuser",
    "cookies.customize": "Personnaliser",
    "cookies.necessary": "Nécessaires",
    "cookies.analytics": "Analytiques",
    "cookies.marketing": "Marketing",
    "cookies.preferences": "Préférences",
    "cookies.save": "Enregistrer les Préférences",
    "cookies.learnMore": "En savoir plus",
  },

  de: {
    // Navigation
    "nav.platform": "Plattform",
    "nav.solutions": "Lösungen",
    "nav.demo": "Demo Anfordern",
    "nav.pricing": "Preise",
    "nav.contact": "Kontakt",

    // Hero Section
    "hero.tagline": "Die Kommandoplattform für Unternehmens-KI",
    "hero.title.line1": "Intelligenz,",
    "hero.title.line2": "Nach Design",
    "hero.description": "Wechseln Sie vom Hochrisiko-KI-Chaos zu einer sicheren, konformen und vollständig verwalteten KI-Belegschaft. ArqAI ist die erste integrierte Kommandoplattform für Unternehmens-KI-Governance.",
    "hero.cta.primary": "Demo Anfordern",
    "hero.cta.secondary": "Plattform Erkunden",

    // Problem Section
    "problem.title": "Die Unternehmens-KI-Krise",
    "problem.subtitle": "Organisationen setzen KI ohne Governance-Framework zur Risikoverwaltung ein",
    "problem.stat1.value": "73%",
    "problem.stat1.label": "der Unternehmen fehlt KI-Governance",
    "problem.stat2.value": "4,2M$",
    "problem.stat2.label": "durchschnittliche Kosten bei KI-Compliance-Versagen",
    "problem.stat3.value": "89%",
    "problem.stat3.label": "berichten über Schatten-KI-Bedenken",

    // Solution Section
    "solution.title": "Eine Plattform. Vollständige Kontrolle.",
    "solution.subtitle": "ArqAI vereint alles, was Sie benötigen, um KI sicher im Unternehmensmaßstab einzusetzen",
    "solution.governance.title": "Governance",
    "solution.governance.description": "Vollständige Transparenz und Kontrolle über jeden KI-Agenten in Ihrer Organisation",
    "solution.security.title": "Sicherheit",
    "solution.security.description": "Unternehmenssicherheit mit integrierter SOC 2, HIPAA und DSGVO-Konformität",
    "solution.orchestration.title": "Orchestrierung",
    "solution.orchestration.description": "Bereitstellung, Verwaltung und Skalierung von KI-Agenten in Ihrer gesamten Infrastruktur",

    // CTA Section
    "cta.title": "Bereit, die Kontrolle über Ihre KI zu übernehmen?",
    "cta.subtitle": "Schließen Sie sich führenden Unternehmen an, die ArqAI für die Verwaltung ihrer KI-Belegschaft vertrauen.",
    "cta.button": "Demo Vereinbaren",

    // Footer
    "footer.company": "Unternehmen",
    "footer.about": "Über Uns",
    "footer.careers": "Karriere",
    "footer.press": "Presse",
    "footer.resources": "Ressourcen",
    "footer.blog": "Blog",
    "footer.documentation": "Dokumentation",
    "footer.legal": "Rechtliches",
    "footer.privacy": "Datenschutzrichtlinie",
    "footer.terms": "Nutzungsbedingungen",
    "footer.copyright": "© 2025 ArqAI. Alle Rechte vorbehalten.",

    // Chat Widget
    "chat.greeting": "Hallo! Ich bin der ArqAI-Assistent. Wie kann ich Ihnen heute helfen?",
    "chat.placeholder": "Fragen Sie mich alles über ArqAI...",
    "chat.send": "Senden",

    // Cookie Consent
    "cookies.title": "Wir schätzen Ihre Privatsphäre",
    "cookies.description": "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, den Seitenverkehr zu analysieren und Inhalte zu personalisieren.",
    "cookies.acceptAll": "Alle Akzeptieren",
    "cookies.rejectAll": "Alle Ablehnen",
    "cookies.customize": "Anpassen",
    "cookies.necessary": "Notwendig",
    "cookies.analytics": "Analytik",
    "cookies.marketing": "Marketing",
    "cookies.preferences": "Präferenzen",
    "cookies.save": "Einstellungen Speichern",
    "cookies.learnMore": "Mehr erfahren",
  },

  ja: {
    // Navigation
    "nav.platform": "プラットフォーム",
    "nav.solutions": "ソリューション",
    "nav.demo": "デモをリクエスト",
    "nav.pricing": "料金",
    "nav.contact": "お問い合わせ",

    // Hero Section
    "hero.tagline": "エンタープライズAIのコマンドプラットフォーム",
    "hero.title.line1": "インテリジェンス、",
    "hero.title.line2": "デザインによる",
    "hero.description": "高リスクのAIカオスから、安全でコンプライアンスに準拠した完全に管理されたAIワークフォースへ。ArqAIは、エンタープライズAIガバナンスのための業界初の統合コマンドプラットフォームです。",
    "hero.cta.primary": "デモをリクエスト",
    "hero.cta.secondary": "プラットフォームを探索",

    // Problem Section
    "problem.title": "エンタープライズAI危機",
    "problem.subtitle": "組織はリスクを管理するためのガバナンスフレームワークなしにAIを導入しています",
    "problem.stat1.value": "73%",
    "problem.stat1.label": "の企業がAIガバナンスを欠いている",
    "problem.stat2.value": "420万ドル",
    "problem.stat2.label": "AIコンプライアンス違反の平均コスト",
    "problem.stat3.value": "89%",
    "problem.stat3.label": "がシャドーAIの懸念を報告",

    // Solution Section
    "solution.title": "1つのプラットフォーム。完全な制御。",
    "solution.subtitle": "ArqAIは、エンタープライズ規模でAIを安全に導入するために必要なすべてを統合します",
    "solution.governance.title": "ガバナンス",
    "solution.governance.description": "組織内のすべてのAIエージェントに対する完全な可視性と制御",
    "solution.security.title": "セキュリティ",
    "solution.security.description": "SOC 2、HIPAA、GDPRコンプライアンスを備えたエンタープライズグレードのセキュリティ",
    "solution.orchestration.title": "オーケストレーション",
    "solution.orchestration.description": "インフラストラクチャ全体でAIエージェントを導入、管理、スケール",

    // CTA Section
    "cta.title": "AIの制御を取る準備はできましたか？",
    "cta.subtitle": "ArqAIを信頼してAIワークフォースを管理している主要企業に参加してください。",
    "cta.button": "デモを予約",

    // Footer
    "footer.company": "会社",
    "footer.about": "会社概要",
    "footer.careers": "採用情報",
    "footer.press": "プレス",
    "footer.resources": "リソース",
    "footer.blog": "ブログ",
    "footer.documentation": "ドキュメント",
    "footer.legal": "法的情報",
    "footer.privacy": "プライバシーポリシー",
    "footer.terms": "利用規約",
    "footer.copyright": "© 2025 ArqAI. All rights reserved.",

    // Chat Widget
    "chat.greeting": "こんにちは！ArqAIアシスタントです。今日はどのようにお手伝いできますか？",
    "chat.placeholder": "ArqAIについて何でも聞いてください...",
    "chat.send": "送信",

    // Cookie Consent
    "cookies.title": "プライバシーを大切にしています",
    "cookies.description": "エクスペリエンスの向上、サイトトラフィックの分析、コンテンツのパーソナライズにCookieを使用しています。",
    "cookies.acceptAll": "すべて同意",
    "cookies.rejectAll": "すべて拒否",
    "cookies.customize": "カスタマイズ",
    "cookies.necessary": "必須",
    "cookies.analytics": "分析",
    "cookies.marketing": "マーケティング",
    "cookies.preferences": "設定",
    "cookies.save": "設定を保存",
    "cookies.learnMore": "詳細を見る",
  },
};

/**
 * Get a translation by key
 */
export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale): Record<string, string> {
  return {
    ...translations.en,
    ...translations[locale],
  };
}
