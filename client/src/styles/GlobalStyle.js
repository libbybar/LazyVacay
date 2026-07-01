import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    background-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E"),
      repeating-radial-gradient(
        circle at 20% 35%,
        transparent 0px, transparent 44px,
        rgba(44, 62, 80, 0.022) 44px, rgba(44, 62, 80, 0.022) 45px
      ),
      repeating-radial-gradient(
        circle at 78% 62%,
        transparent 0px, transparent 59px,
        rgba(44, 62, 80, 0.016) 59px, rgba(44, 62, 80, 0.016) 60px
      );
    background-size: 200px 200px, 1000px 800px, 800px 1000px;

    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.main};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.6;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }
`;