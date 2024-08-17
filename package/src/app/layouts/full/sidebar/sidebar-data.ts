import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Inicio',
  },
  {
    displayName: 'Calendario',
    iconName: 'calendar-month',
    route: '/calendar',
  },
  {
    navCap: 'Configuración',
  },
  {
    displayName: 'Deportes',
    iconName: 'ball-basketball',
    route: '/sports-config',
  },
];
