'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FAQ } from '@/components/blocks/FAQ';
import { HeroBackgroundVideo } from '@/components/blocks/PageHero';
import { DualCtas } from '@/components/landings/DualCtas';
import { LandingChrome } from '@/components/landings/LandingChrome';
import { TreatmentCalculator } from '@/components/clinicas-dentales/TreatmentCalculator';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { MinimalLeadForm } from '@/components/verticals/MinimalLeadForm';
import { trackEvent } from '@/lib/analytics';
import { site } from '@/lib/site';
import {
  CALCULATOR_STORAGE_KEY,
  CLINICAS_DENTALES_MARKETS,
  type ClinicasDentalesMarket,
  type ClinicasDentalesMarketId,
} from '@/lib/clinicas-dentales/markets';

type Props = {
  market: ClinicasDentalesMarket;
};

const MARKET_IDS = Object.keys(
  CLINICAS_DENTALES_MARKETS,
) as ClinicasDentalesMarketId[];

export function ClinicasDentalesLanding({ market }: Props) {
  const t = useTranslations('ClinicasDentales');
  const tc = useTranslations('Common');
  const tn = useTranslations('Nav');
  const problems = t.raw('problems') as { n: string; text: string }[];
  const benefits = t.raw('benefits') as { title: string; text: string }[];
  const faqs = t.raw('faqs') as { q: string; a: string }[];
  const handoffAutomationItems = t.raw('handoffAutomationItems') as string[];
  const handoffClinicItems = t.raw('handoffClinicItems') as string[];

  const trackWa = (source: string) =>
    trackEvent('WhatsAppClick', {
      market: market.id,
      source,
      page: 'clinicas-dentales',
    });
  const trackCal = (source: string) =>
    trackEvent('ScheduleStart', {
      market: market.id,
      source,
      page: 'clinicas-dentales',
    });

  return (
    <div className="clinicas-dentales-landing pt-[76px] pb-20 md:pb-0">
      <LandingChrome
        vertical="clinicas-dentales"
        marketId={market.id}
        whatsappMessage={market.whatsappMessage}
      />

      <nav
        aria-label="Breadcrumb"
        className="theme-dark border-b border-line bg-ink-950"
      >
        <div className="container-x flex flex-wrap items-center gap-2 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          <Link href="/" className="hover:text-accent">
            {tc('home')}
          </Link>
          <span>/</span>
          <Link href="/clinicas-dentales" className="hover:text-accent">
            {t('crumb')}
          </Link>
          <span>/</span>
          <span className="text-fg">{market.country}</span>
        </div>
      </nav>

      <div className="theme-dark border-b border-line bg-ink-900">
        <div className="container-x flex flex-wrap items-center gap-2 py-3">
          <span className="mono-label text-faint">{tc('market')}</span>
          {MARKET_IDS.map((id) => {
            const m = CLINICAS_DENTALES_MARKETS[id];
            const active = id === market.id;
            return (
              <Link
                key={id}
                href={`/clinicas-dentales/${id}`}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? 'bg-accent text-accent-fg'
                    : 'border border-line text-muted hover:border-accent hover:text-fg'
                }`}
              >
                {m.country}
              </Link>
            );
          })}
        </div>
      </div>

      {/* HERO — video actual conservado */}
      <section className="relative overflow-hidden bg-ink-950 pt-20 pb-20 sm:pt-24 sm:pb-28">
        {market.videoSrc ? (
          <HeroBackgroundVideo src={market.videoSrc} />
        ) : (
          <div className="hero-accent-fade absolute inset-0" aria-hidden="true" />
        )}
        <div className="grain absolute inset-0" aria-hidden="true" />

        <div className="container-x relative z-[1]">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>{t('heroEyebrow')}</Eyebrow>
              <h1 className="mt-5 text-[2.15rem] font-semibold leading-[0.98] tracking-tight text-fg sm:text-5xl lg:text-[3.25rem]">
                {t('heroTitle')}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                {t('heroSubtitle')}
              </p>
              <div className="mt-8">
                <DualCtas
                  whatsappMessage={market.whatsappMessage}
                  onWhatsApp={() => trackWa('hero')}
                  onSchedule={() => trackCal('hero')}
                />
              </div>
              <p className="mt-4 text-sm text-faint">{t('heroMicro')}</p>
              <p className="mt-4">
                <a
                  href="#calculadora"
                  className="text-sm text-muted link-underline hover:text-accent"
                >
                  {t('heroCalcLink')}
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <Section tone="light" id="problema">
        <SectionHeading
          eyebrow={t('problemEyebrow')}
          title={t('problemTitle')}
          description={t('problemIntro')}
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {problems.map((item, i) => (
            <Reveal
              key={item.n}
              delay={i * 50}
              className="border border-line bg-paper p-6"
            >
              <span className="font-mono text-xs text-accent">{item.n}</span>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-lg text-muted">{t('problemClose')}</p>
      </Section>

      {/* CALCULADORA */}
      <Section tone="dark" id="calculadora">
        <SectionHeading eyebrow={t('calcEyebrow')} title={t('calcTitle')} />
        <div className="mt-12">
          <TreatmentCalculator market={market} />
        </div>
      </Section>

      {/* BENEFICIOS */}
      <Section tone="soft" id="como-ayudamos">
        <SectionHeading
          eyebrow={t('benefitsEyebrow')}
          title={t('benefitsTitle')}
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {benefits.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 50}
              className="border border-line bg-paper p-6"
            >
              <p className="mono-label text-accent">{item.title}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-[15px] text-muted">
          {t('integrateNote')}
        </p>
      </Section>

      {/* CONFIANZA / HANDOFF */}
      <Section tone="light" id="confianza">
        <SectionHeading
          eyebrow={t('trustEyebrow')}
          title={t('trustTitle')}
          description={t('trustText')}
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Reveal className="border border-line bg-paper p-7">
            <p className="mono-label text-muted">{t('handoffAutomation')}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink/75">
              {handoffAutomationItems.map((item) => (
                <li key={item} className="border-b border-line py-2">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={60} className="border border-line bg-paper p-7">
            <p className="mono-label text-accent">{t('handoffClinic')}</p>
            <ul className="mt-5 space-y-2 text-sm text-ink/75">
              {handoffClinicItems.map((item) => (
                <li key={item} className="border-b border-line py-2">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="mt-10">
          <DualCtas
            whatsappMessage={market.whatsappMessage}
            onWhatsApp={() => trackWa('confianza')}
            onSchedule={() => trackCal('confianza')}
          />
        </div>
      </Section>

      {/* PRECIO */}
      {(market.implementationFromUsd != null ||
        market.implementationFromLocal) && (
        <Section tone="dark" id="precio">
          <SectionHeading
            eyebrow={t('priceEyebrow')}
            title={t('priceTitle')}
            description={t('priceText')}
          />
          <Reveal className="mt-10 max-w-xl border border-line bg-surface p-8">
            <p className="mono-label text-accent">{tc('provisionalPrice')}</p>
            {market.implementationFromUsd != null && (
              <p className="mt-4 font-display text-4xl text-fg sm:text-5xl">
                {t('priceFrom', { amount: market.implementationFromUsd })}
              </p>
            )}
            {market.implementationFromLocal && (
              <p className="mt-2 text-sm text-muted">
                {market.implementationFromLocal}
              </p>
            )}
            {market.showMonthly && market.monthlyFromUsd != null ? (
              <p className="mt-4 font-mono text-sm text-accent">
                {t('priceMonthly', { amount: market.monthlyFromUsd })}
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted">
                {tc('monthlyDefinedByScope')}
              </p>
            )}
            <DualCtas
              className="mt-6"
              size="md"
              whatsappMessage={market.whatsappMessage}
              onWhatsApp={() => trackWa('precio')}
              onSchedule={() => trackCal('precio')}
            />
          </Reveal>
        </Section>
      )}

      {/* CONTACTO */}
      <Section tone="soft" id="contacto">
        <SectionHeading
          eyebrow={t('formEyebrow')}
          title={t('contactSectionTitle')}
          description={t('formDesc')}
        />
        <div className="mt-10 max-w-3xl space-y-8">
          <div>
            <p className="mono-label text-accent">{tc('talkToTeam')}</p>
            <p className="mt-3 max-w-xl text-[15px] text-muted">
              {t('formMicro')}
            </p>
            <DualCtas
              className="mt-6"
              whatsappMessage={market.whatsappMessage}
              onWhatsApp={() => trackWa('contact_section')}
              onSchedule={() => trackCal('contact_section')}
            />
          </div>
          <div className="border-t border-line pt-8">
            <p className="mb-5 text-sm text-muted">{t('formTitle')}</p>
            <MinimalLeadForm
              i18nNamespace="ClinicasDentales"
              vertical="clinicas-dentales"
              country={market.country}
              landingPath={`/clinicas-dentales/${market.id}`}
              origen={`clinicas-dentales-${market.id}`}
              servicio="Conversión tratamientos clínicas dentales"
              whatsappMessage={market.whatsappMessage}
              calculatorStorageKey={CALCULATOR_STORAGE_KEY}
            />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="light" id="faq">
        <SectionHeading
          eyebrow={t('faqEyebrow')}
          title={t('faqTitle')}
          align="center"
        />
        <div className="mt-12">
          <FAQ items={faqs} />
        </div>
      </Section>

      <section className="theme-dark border-t border-line bg-ink-950 py-10 text-fg">
        <div className="container-x flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <Link href="/inmobiliarias" className="hover:text-accent">
              {tn('inmobiliarias')}
            </Link>
            <Link href="/remodelaciones" className="hover:text-accent">
              {tn('remodelaciones')}
            </Link>
            <Link href="/contacto" className="hover:text-accent">
              {tc('contact')}
            </Link>
            <Link href="/privacidad" className="hover:text-accent">
              {tc('privacy')}
            </Link>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
            {market.country} · {site.name}
          </p>
        </div>
      </section>
    </div>
  );
}
