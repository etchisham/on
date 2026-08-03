'use client';

import { useState, useId, useCallback, memo } from 'react';

export type FaqItemViewModel = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export type FaqAccordionProps = {
  readonly items: readonly FaqItemViewModel[];
  readonly heading?: string;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
      className="faqchevron"
      style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path
        fill="currentColor"
        d="M16.3486 8.24122C16.7327 7.9107 17.3128 7.91828 17.6885 8.27443C18.089 8.65446 18.1055 9.28781 17.7256 9.68849L13.168 14.4951C12.5295 15.1682 11.4705 15.1682 10.832 14.4951L6.27442 9.68849C5.89457 9.2878 5.91104 8.65444 6.31153 8.27443C6.71219 7.89452 7.34556 7.91108 7.7256 8.31154L12 12.8213L16.2744 8.31154L16.3486 8.24122Z"
      />
    </svg>
  );
}

type AccordionItemProps = {
  readonly item: FaqItemViewModel;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly buttonId: string;
  readonly panelId: string;
};

const AccordionItem = memo(function AccordionItem({
  item,
  expanded,
  onToggle,
  buttonId,
  panelId,
}: AccordionItemProps) {
  return (
    <div className="faqitem">
      <h3 role="heading">
        <button
          type="button"
          id={buttonId}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="faqtrigger"
          onClick={onToggle}
        >
          <span className="faqquestion">{item.question}</span>
          <ChevronIcon expanded={expanded} />
        </button>
      </h3>
      <div
        className="faqcontentwrapper"
        style={{
          display: 'block',
          opacity: expanded ? 1 : 0,
          height: expanded ? 'auto' : '0px',
          visibility: expanded ? 'visible' : 'hidden',
          overflow: 'hidden',
        }}
      >
        <div
          role="region"
          id={panelId}
          aria-labelledby={buttonId}
          className="faqpanel"
        >
          <div className="faqanswer">{item.answer}</div>
        </div>
      </div>
    </div>
  );
});

export function FaqAccordion({ items, heading = 'Frequently asked questions' }: FaqAccordionProps) {
  const baseId = useId();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((itemId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="faqsection container" aria-labelledby={`${baseId}-heading`}>
      <div className="faqheader">
        <h2 id={`${baseId}-heading`} className="faqheading">{heading}</h2>
      </div>
      <div className="faqaccordion" role="list">
        {items.map((item, index) => {
          const buttonId = `${baseId}-button-${index}`;
          const panelId = `${baseId}-panel-${index}`;
          const expanded = expandedIds.has(item.id);

          return (
            <AccordionItem
              key={item.id}
              item={item}
              expanded={expanded}
              onToggle={() => handleToggle(item.id)}
              buttonId={buttonId}
              panelId={panelId}
            />
          );
        })}
      </div>
    </section>
  );
}
