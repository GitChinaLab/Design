# Codeberg Design Toolkit

The Codeberg design toolkit provides neccessary tools to build pages with the uniform Codeberg look and feel.

It's based on [Halfmoon](https://www.gethalfmoon.com/) and [Vue 3](https://v3.vuejs.org/), and provides you with a simple way to either create custom scoped widgets using Codeberg's style, or to create whole pages using the Codeberg design.

## How to use the Halfmoon stylesheet

```html
<!-- In your <head> tag: -->
<link rel="icon" href="https://design.codeberg.org/logo-kit/favicon.ico" type="image/x-icon" />
<link rel="icon" href="https://design.codeberg.org/logo-kit/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="https://design.codeberg.org/logo-kit/apple-touch-icon.png" />

<link rel="stylesheet" href="https://design.codeberg.org/design-kit/codeberg.css" />
<script defer src="https://design.codeberg.org/design-kit/codeberg.js"></script>
<script defer type="module" src="https://design.codeberg.org/components/codeberg-components.js"></script>

<link href="https://fonts.codeberg.org/dist/inter/Inter%20Web/inter.css" rel="stylesheet" />
<link href="https://fonts.codeberg.org/dist/fontawesome5/css/all.min.css" rel="stylesheet" />

<!-- To use the design for the whole page: -->
<html class="codeberg-design">
  <!-- ... -->
</html>

<!-- To only use the design for specific components: -->
<div class="codeberg-design">
  <!-- You can use Halfmoon classes here, and it will use Codeberg's design! -->
</div>
```

## How to create custom components

1. Create your component in the `components/src/components` folder of this repository
2. Add a sample to the `components/index.html` file
3. Start the development server using `npm run dev`
4. Before committing any changes, run `npm run fix` to format your code and `npm run build` to update the output files
