
import { ref } from 'vue';

export function useTabs(initialTab: string) {
    const activeTab = ref(initialTab);

    const setActiveTab = (tab: string) => {
        activeTab.value = tab;
    };

    return { activeTab, setActiveTab };
}
