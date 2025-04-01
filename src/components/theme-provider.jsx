
import { createContext, useState, useEffect } from "react"

const ThemeContext = createContext()

const ThemeProvider = ({ defaultTheme, storageKey, children }) => {
  const [theme, setTheme] = useState(defaultTheme || "light")

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey)
    setTheme(storedTheme || defaultTheme || "light")
  }, [defaultTheme, storageKey])

  useEffect(() => {
    localStorage.setItem(storageKey, theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme, storageKey])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider }

