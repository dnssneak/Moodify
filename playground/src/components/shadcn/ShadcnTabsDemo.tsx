import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

export const ShadcnTabsDemo: React.FC = () => {
  return (
    <Tabs.Root defaultValue="overview" className="shadcn-tabs-root">
      <Tabs.List className="shadcn-tablist" aria-label="Shadcn Radix Tabs Demo">
        <Tabs.Trigger value="overview" className="shadcn-tab-trigger">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="features" className="shadcn-tab-trigger">
          Features
        </Tabs.Trigger>
        <Tabs.Trigger value="settings" className="shadcn-tab-trigger">
          Settings
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview" className="shadcn-tab-content">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Radix Tabs: Overview</h4>
        <p>Built-in roving tabindex, arrow key navigation, and automatic/manual activation modes.</p>
      </Tabs.Content>
      <Tabs.Content value="features" className="shadcn-tab-content">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Radix Tabs: Features</h4>
        <p>Supports horizontal and vertical orientation (`orientation="vertical"`), custom directional key binding, and full ARIA compliance.</p>
      </Tabs.Content>
      <Tabs.Content value="settings" className="shadcn-tab-content">
        <h4 style={{ margin: '0 0 0.5rem 0' }}>Radix Tabs: Settings</h4>
        <p>Decoupled primitive design allows effortless custom styling via CSS or utility classes.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
};
