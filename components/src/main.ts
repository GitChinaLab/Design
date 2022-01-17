// Source: https://github.com/vuejs/vue-cli/issues/6033#issuecomment-735229344
import { createApp, watch } from "vue";
class CustomElement extends HTMLElement {
	public component: any;
	public instance: any;
	constructor() {
		super();
	}
	connectedCallback() {
		const options =
			typeof this.component === "function"
				? this.component.options
				: this.component;
		const propsList: string[] = Array.isArray(options.props)
			? options.props
			: Object.keys(options.props || {});
		const props: { [index: string]: string } = {};
		for (const prop of propsList) {
			const propName = prop.replace(/[A-Z]/g, x => "-" + x.toLowerCase());
			const propValue = this.getAttribute(propName);
			if (!propValue) {
				console.error(`Missing attribute ${propName}`);
				return;
			}
			props[prop] = propValue;
		}
		this.instance = createApp(this.component, props);
		this.instance.mount(this);
		this.classList.add("codeberg-design");
	}
}

// codeberg-design-example
import CodebergAnnouncementWidget from "./components/codeberg-announcement-widget.vue";
class CodebergAnnouncementWidgetElement extends CustomElement {
	component = CodebergAnnouncementWidget;
}
window.customElements.define(
	"codeberg-announcement-widget",
	CodebergAnnouncementWidgetElement
);
