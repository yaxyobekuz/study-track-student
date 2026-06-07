// Components
import Tabs from "@/shared/components/ui/Tabs";

// Data
import { testTabs } from "@/features/tests/data/testTabs.data";

const TestsTabs = () => {
  return (
    <Tabs
      activePathIndex={1}
      listClassName="w-full"
      items={testTabs}
      getItemHref={(item) => item.path}
    />
  );
};

export default TestsTabs;
