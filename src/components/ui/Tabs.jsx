import React, { useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

export default function Tabs({ tabs, defaultTab, children }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  return (
    <div>
      <div className="relative flex gap-6 border-b border-brand-text/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              "relative pb-3 text-sm font-medium transition-colors",
              active === tab.id ? "text-brand-accent" : "text-brand-text/50 hover:text-brand-text"
            )}
          >
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute -bottom-px left-0 right-0 h-0.5 rounded-full bg-brand-accent"
              />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{children(active)}</div>
    </div>
  );
}
