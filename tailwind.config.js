/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray1: "#F8F8F8",
        gray2: "#E5E8EB",
        gray3: "#CBD1D7",
        gray4: "#B9C2CA",
        gray5: "#A2ADB9",
        gray6: "#8B96A2",
        gray7: "#74808B",
        gray8: "#5D6974",
        gray9: "#424D57",
        gray10: "#28333E",
        white: "#FFFFFF",
        black: "#000000",
        mstYellow: {
          DEFAULT: "#005A9C",
          dark: "#28333E",
        },
        statusGreen: "#5EB044",
        statusYellow: "#FFD335",
        statusRed: "#E84747",
        statusBlue: "#0A8AD8",
        darkBgColor: '#000',
      },
     
      fontFamily: {
        verdana: ['Verdana', 'sans-serif'], // Verdana fontunu ekledik
        sans: ['Arial', 'sans-serif'], // Arial fontunu ekliyoruz
        righteous: ['Righteous', 'sans-serif'],
        inter: ['Inter', 'sans-serif'], // Inter fontunu ekliyoruz
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],


      },
      writingMode: {
        'vertical-lr': 'vertical-lr',
      },
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

