import { motion } from 'framer-motion';

export default function Section({ id, label, heading, subheading, children, className = '' }) {
  return (
    <section id={id} className={`relative py-24 md:py-36 px-5 md:px-8 ${className}`}>
      <div className="mx-auto max-w-6xl relative z-10">
        {(label || heading) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 md:mb-20"
          >
            {label && <span className="section-label mb-6 block">{label}</span>}
            {heading && (
              <h2 className="section-heading max-w-4xl text-balance">{heading}</h2>
            )}
            {subheading && (
              <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl text-pretty leading-relaxed">
                {subheading}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
