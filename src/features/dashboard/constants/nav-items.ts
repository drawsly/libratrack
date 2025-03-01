import { NavItem } from '@/shared/types/nav-items';

export const navItems: NavItem[] = [
  {
    title: 'Kontrol Paneli',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Kitap İşlemleri',
    url: '/dashboard/books',
    icon: 'BookMarked',
    shortcut: ['k', 'k'],
    isActive: true,
    items: []
  },
  {
    title: 'Okuyucu İşlemleri',
    url: '/dashboard/readers',
    icon: 'UserSquare2',
    shortcut: ['o', 'o'],
    isActive: false,
    items: []
  },
  {
    title: 'Emanet İşlemleri',
    url: '/dashboard/books/loans',
    icon: 'NotebookText',
    shortcut: ['e', 'e'],
    isActive: false,
    items: []
  }
];
