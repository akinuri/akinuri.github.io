<template data-name="menu-item">
    <li>
        <a
            href="{{ href }}"
            class="px-2 py-1 rounded block bg-slate-300 hover:bg-slate-400/75 active:bg-slate-400 {{ href == location.pathname ? '!bg-blue-300' : '' }}"
        >{{ content }}</a>
    </li>
</template>

<template data-name="menu">
    <aside class="w-[200px]">
        <nav>
            <!-- <h2 class="mb-4 font-semibold text-lg border-b border-b-slate-400">Examples</h2> -->
            <ul class="flex flex-col gap-4">
                <menu-item data-template-data='{"href":"/01_use_plain_html.html"}'>Use plain HTML</menu-item>
                <menu-item data-template-data='{"href":"/02_pass_content.html"}'>Pass Content</menu-item>
                <menu-item data-template-data='{"href":"/03_pass_attr.html"}'>Pass Attributes</menu-item>
                <menu-item data-template-data='{"href":"/04_nested_placeholders.html"}'>
                    Nested Placeholders
                </menu-item>
                <menu-item data-template-data='{"href":"/05_run_js.html"}'>Pass Data & Run JS</menu-item>
                <menu-item data-template-data='{"href":"/06_pass_prop.html"}'>Pass Data via Tags</menu-item>
            </ul>
        </nav>
    </aside>
</template>