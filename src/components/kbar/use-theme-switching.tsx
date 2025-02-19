import { useRegisterActions } from 'kbar';
import { useTheme } from 'next-themes';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themeAction = [
    {
      id: 'toggleTheme',
      name: 'Temayı Değiştir',
      shortcut: ['t', 't'],
      section: 'Tema',
      perform: toggleTheme,
    },
  ];

  useRegisterActions(themeAction, [theme]);
};

export default useThemeSwitching;
