import css from './css/style.css';

const addCSS = () => {

  const defaultStyle = document.createElement("style");
  defaultStyle.type = "text/css";
  defaultStyle.setAttribute("floating-ui-tooltip-default", "");
  defaultStyle.textContent = css;

  document.head.appendChild(defaultStyle);
}

export default addCSS;
