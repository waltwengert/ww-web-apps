import type { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import {
    faAddressCard,
    faBriefcase,
    faKeyboard,
    faUserGraduate
} from '@fortawesome/free-solid-svg-icons';

export const SECTION_IDS = [
    'about',
    'projects',
    'education',
    'employment'
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const MOBILE_WIDTH = 600;
export const WIDE_WIDTH = 1400;

export const NAV_ITEMS: Array<{
    id: SectionId;
    buttonId: string;
    label: string;
    icon: IconDefinition;
}> = [
    {
        id: 'about',
        buttonId: 'btnAbout',
        label: 'About',
        icon: faAddressCard
    },
    {
        id: 'projects',
        buttonId: 'btnProj',
        label: 'Projects',
        icon: faKeyboard
    },
    {
        id: 'education',
        buttonId: 'btnEdu',
        label: 'Education',
        icon: faUserGraduate
    },
    {
        id: 'employment',
        buttonId: 'btnEmp',
        label: 'Employment',
        icon: faBriefcase
    }
];

export function getScrollHeights(): {
    headingHeight: number;
    buttonsHeight: number;
} {
    if (window.innerWidth >= WIDE_WIDTH) {
        return { headingHeight: 310, buttonsHeight: 78 };
    }

    if (window.innerWidth >= MOBILE_WIDTH) {
        return { headingHeight: 280, buttonsHeight: 78 };
    }

    return { headingHeight: 250, buttonsHeight: 54 };
}
