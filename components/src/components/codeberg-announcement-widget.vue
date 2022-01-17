<template>
	<div
		:class="['codeberg-alert', 'alert', 'p-10'].concat(announcement.classes || [])"
		style="margin-bottom: 1rem"
		role="alert"
		v-for="announcement in filteredAnnouncements()"
		:key="announcement.timestamp"
	>
		<button
			class="close"
			data-dismiss="alert"
			type="button"
			:aria-label="PGettext('alerts', 'Close')"
			v-if="announcement.dismissable !== false"
			@click="dismissAnnouncement(announcement)"
		>
			<span aria-hidden="true">&times;</span>
		</button>
		<div v-html="formatAnnouncement(announcement)" class="margin-fix-last-child"></div>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { Converter } from "showdown";
import { parse as parseTOML } from "toml";

export default defineComponent({
	name: "codeberg-announcement-widget",
	props: {
		configurationUrl: String,
	},
	setup: function() {
		const announcements = ref([]);

		const converter = new Converter({
			noHeaderId: true,
			headerLevelStart: 4,
			simplifiedAutoLink: true,
			strikethrough: true,
			tables: true,
			tasklists: true,
			emoji: true,
			ghMentions: true,
			ghMentionsLink: "https://codeberg.org/{u}",
			openLinksInNewWindow: true,
		});
		const formatAnnouncement = function(announcement) {
			const source =
				announcement[
					navigator.languages.find((lang) => lang in announcement) || "en"
				];
			return converter
				.makeHtml(source)
				.replace(/<h4>/g, '<h4 class="alert-heading">')
				.replace(/@<a /g, '<a class="btn btn-primary d-block mt-10" ');
		};
		const filteredAnnouncements = function() {
			const now = Date.now();
			return this.announcements.filter((a) =>
				a.visible !== false &&
				(!a.visibleUntil || a.visibleUntil > now) &&
				!isDismissed(a)
			).slice(0, 3);
		}

		const dismissedAnnouncements = ref((localStorage.getItem("codeberg-announcement-dismissals") || "").split("|"));
		const dismissAnnouncement = function(announcement) {
			Object.assign(dismissedAnnouncements, (localStorage.getItem("codeberg-announcement-dismissals") || "").split("|"));
			if (!isDismissed(announcement)) {
				dismissedAnnouncements.value.push(announcement.timestamp.toISOString() + "@" + Date.now());
			}
			localStorage.setItem("codeberg-announcement-dismissals", dismissedAnnouncements.value.filter(x => x).join("|"));
		};
		const isDismissed = function(announcement) {
			const index = dismissedAnnouncements.value.findIndex(x => x.startsWith(announcement.timestamp.toISOString() + "@"));
			if (index < 0) return false;

			const dismissal = dismissedAnnouncements.value[index].substr(index + (announcement.timestamp.toISOString() + "@").length);
			return Number(dismissal) || true;
		};

		// TODO: use real language files
		const Gettext = {
			Gettext: (x) => x,
			PGettext: (a, x) => x,
			NPGettext: (a, x) => x,
			NGettext: (x) => x,
		};

		return {
			announcements,
			formatAnnouncement,
			filteredAnnouncements,
			dismissAnnouncement,
			isDismissed,
			...Gettext,
		};
	},
	mounted: async function() {
		const res = await fetch(this.configurationUrl);
		const source = await res.text();
		const config = parseTOML(source);
		Object.assign(this.announcements, config.announcement);
	},
});
</script>
