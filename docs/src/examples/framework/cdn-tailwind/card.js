import { defineComponent } from '@semantic-ui/component';
import { TailwindPlugin } from '@semantic-ui/tailwind';

let definition = {
  tagName: 'my-card',
  template: `
    <article class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div class="h-40 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"></div>
      <div class="p-6">
        <div class="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>{category}</span>
          <span aria-hidden="true">·</span>
          <span>{readTime}</span>
        </div>
        <h3 class="mb-2 text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
          {title}
        </h3>
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {excerpt}
        </p>
        <div class="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div class="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 ring-2 ring-white dark:ring-slate-900"></div>
          <div class="text-xs leading-tight">
            <div class="font-medium text-slate-900 dark:text-white">{author}</div>
            <div class="text-slate-500">{date}</div>
          </div>
        </div>
      </div>
    </article>
  `,
  css: `
    :host { display: block; max-width: 24rem; }
  `,
  defaultSettings: {
    title: '',
    excerpt: '',
    category: '',
    readTime: '',
    author: '',
    date: '',
  },
};

definition = await TailwindPlugin(definition);
defineComponent(definition);
