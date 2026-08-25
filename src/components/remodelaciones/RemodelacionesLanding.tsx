'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FAQ } from '@/components/blocks/FAQ';
import { HeroBackgroundVideo } from '@/components/blocks/PageHero';
import { DualCtas } from '@/components/landings/DualCtas';
import { LandingChrome } from '@/components/landings/LandingChrome';
import { BudgetCalculator } from '@/components/remodelaciones/BudgetCalculator';
import { Section, SectionHeading, Eyebrow } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { MinimalLeadForm } from '@/components/verticals/MinimalLeadForm';
import { trackEvent } from '@/lib/analytics';
import { site } from '@/lib/site';
import {
  CALCULATOR_STORAGE_KEY,
  REMODELACIONES_MARKETS,
  type RemodelacionesMarket,
  type RemodelacionesMarketId,
} from '@/lib/remodelaciones/markets';

type Props = {
  market: RemodelacionesMarket;
};

const MARKET_IDS = Object.keys(
  REMODELACIONES_MARKETS,
) as RemodelacionesMarketId[];

export function RemodelacionesLanding({ market }: Props) {
  const t = useTranslations('Remodelaciones');
  const problems = t.raw('problems') as { n: string; text: string }[];
  const howSteps = t.raw('howSteps') as {
    title: string;
    text: string;
    items?: string[];
  }[];
  const modules = t.raw('modules') as { title: string; text: string }[];
  const diffs = t.raw('diffs') as { title: string; text: string }[];
  const impl = t.raw('implSteps') as { n: string; title: string; text: string }[];
  const faqs = t.raw('faqs') as { q: string; a: string }[];

  const trackWa = (source: string) =>
    trackEvent('WhatsAppClick', {
      market: market.id,
      source,
      page: 'remodelaciones',
    });
  const trackCal = (source: string) =>
    trackEvent('ScheduleStart', {
      market: market.id,
      source,
      page: 'remodelaciones',
    });

  return (
    <div className="remodelaciones-landing pt-[76px] pb-20 md:pb-0">
      <LandingChrome
        vertical="remodelaciones"
        marketId={market.id}
        whatsappMessage={market.whatsappMessage}
      />

      <nav
        aria-label="Breadcrumb"
        className="theme-dark border-b border-line bg-ink-950"
      >
        <div className="container-x flex flex-wrap items-center gap-2 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
          <Link href="/" className="hover:text-accent">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/remodelaciones" className="hover:text-accent">
            {t('crumb')}
          </Link>
          <span>/</span>
          <span className="text-fg">{market.country}</span>
        </div>
      </nav>

      <div className="theme-dark border-b border-line bg-ink-900">
        <div className="container-x flex flex-wrap items-center gap-2 py-3">
          <span className="mono-label text-faint">Mercado</span>
          {MARKET_IDS.map((id) => {
            const m = REMODELACIONES_MARKETS[id];
            const active = id === market.id;
            return (
              <Link
                key={id}
                href={`/remodelaciones/${id}`}
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
          <>
            <div className="hero-accent-fade absolute inset-0" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-grid-fade [background-size:64px_64px] opacity-30 [mask-image:radial-gradient(70%_55%_at_20%_0%,black,transparent)]"
              aria-hidden="true"
            />
          </>
        )}
        <div className="grain absolute inset-0" aria-hidden="true" />

        <div className="container-x relative z-[1]">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow>{t('heroEyebrow')}</Eyebrow>
              <h1 className="mt-5 text-[2.35rem] font-semibold leading-[0.98] tracking-tight text-fg sm:text-5xl lg:text-6xl">
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
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
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
        <SectionHeading
          eyebrow={t('calcEyebrow')}
          title={t('calcTitle')}
        />
        <div className="mt-12">
          <BudgetCalculator market={market} />
        </div>
      </Section>

      {/* CÓMO FUNCIONA */}
      <Section tone="soft" id="como-funciona">
        <SectionHeading eyebrow={t('howEyebrow')} title={t('howTitle')} />
        <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {howSteps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 40}
              className="border border-line bg-paper p-6"
            >
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-2xl normal-case tracking-normal">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
              {step.items && step.items.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-faint"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* MÓDULOS */}
      <Section tone="light" id="modulos">
        <SectionHeading
          eyebrow={t('modulesEyebrow')}
          title={t('modulesTitle')}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <Reveal
              key={mod.title}
              delay={i * 40}
              className="border border-line bg-paper p-6"
            >
              <h3 className="font-display text-2xl normal-case tracking-normal">
                {mod.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
                {mod.text}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* INTEGRACIÓN */}
      <Section tone="dark" id="integracion">
        <SectionHeading
          eyebrow={t('integrateEyebrow')}
          title={t('integrateTitle')}
          description={t('integrateText')}
        />
        <Reveal className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="border border-line bg-surface p-6">
            <p className="mono-label text-faint">{t('integrateTheirLabel')}</p>
            <p className="mt-3 text-lg font-medium text-fg">{t('integrateTheir')}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {(t.raw('integrateTheirItems') as string[]).map((item) => (
                <li key={item} className="border-b border-line py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <span className="hidden text-center font-mono text-accent lg:block">
            +
          </span>
          <div className="border border-accent/40 bg-surface p-6">
            <p className="mono-label text-accent">{t('integrateOursLabel')}</p>
            <p className="mt-3 text-lg font-medium text-fg">{t('integrateOurs')}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {(t.raw('integrateOursItems') as string[]).map((item) => (
                <li key={item} className="border-b border-line py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="mt-8 max-w-2xl text-[15px] text-muted">
          {t('integrateFocus')}
        </p>
      </Section>

      {/* DIFERENCIACIÓN */}
      <Section tone="light" id="diferencia">
        <SectionHeading eyebrow={t('diffEyebrow')} title={t('diffTitle')} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {diffs.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 60}
              className="border border-line bg-paper p-6"
            >
              <p className="mono-label text-accent">{item.title}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
                {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* IMPLEMENTACIÓN */}
      <Section tone="soft" id="implementacion">
        <SectionHeading eyebrow={t('implEyebrow')} title={t('implTitle')} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impl.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 40}
              className="border border-line bg-paper p-5"
            >
              <span className="font-mono text-xs text-accent">{step.n}</span>
              <h3 className="mt-3 font-display text-2xl normal-case tracking-normal">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CONFIANZA */}
      <Section tone="dark" id="confianza">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="relative aspect-[4/3] overflow-hidden border border-line bg-ink-950">
            <Image
              src="/assets/stock/team.jpg"
              alt={t('trustImageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </Reveal>
          <Reveal delay={80}>
            <SectionHeading
              eyebrow={t('trustEyebrow')}
              title={t('trustTitle')}
              description={t('trustText')}
            />
            <ul className="mt-8 space-y-3 text-[15px] text-muted">
              {(t.raw('trustPoints') as string[]).map((point) => (
                <li
                  key={point}
                  className="flex gap-3 border-b border-line py-2 last:border-0"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base font-medium text-fg">
              {t('trustPhrase')}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* CASOS */}
      <Section tone="light" id="casos">
        <SectionHeading
          eyebrow={t('casesEyebrow')}
          title={t('casesTitle')}
          description={t('casesText')}
        />
        <div className="mt-8">
          <DualCtas
            whatsappMessage={market.whatsappMessage}
            onWhatsApp={() => trackWa('casos')}
            onSchedule={() => trackCal('casos')}
          />
        </div>
      </Section>

      {/* PRECIO */}
      <Section tone="soft" id="precio">
        <SectionHeading
          eyebrow={t('priceEyebrow')}
          title={t('priceTitle')}
          description={t('priceText')}
        />
        <Reveal className="mt-10 max-w-xl border border-line bg-paper p-8">
          <p className="mono-label text-accent">Precio provisional</p>
          {market.implementationFromUsd != null && (
            <p className="mt-4 font-display text-4xl text-ink sm:text-5xl">
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
            <p className="mt-4 text-sm text-muted">{t('priceMonthlySoon')}</p>
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

      {/* CONTACTO */}
      <Section tone="dark" id="contacto">
        <SectionHeading
          eyebrow={t('formEyebrow')}
          title="Hablemos de tu proceso comercial"
          description={t('formDesc')}
        />
        <div className="mt-10 max-w-3xl space-y-8">
          <div>
            <p className="mono-label text-accent">Habla con el equipo</p>
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
              i18nNamespace="Remodelaciones"
              vertical="remodelaciones"
              country={market.country}
              landingPath={`/remodelaciones/${market.id}`}
              origen={`remodelaciones-${market.id}`}
              servicio="Conversión presupuestos remodelaciones"
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
              Inmobiliarias
            </Link>
            <Link href="/clinicas-dentales" className="hover:text-accent">
              Clínicas dentales
            </Link>
            <Link href="/contacto" className="hover:text-accent">
              Contacto
            </Link>
            <Link href="/privacidad" className="hover:text-accent">
              Privacidad
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
