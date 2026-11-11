'use strict';

(() => {
    const create = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('work-container');
        if (!container) return;
        (window.workData || []).forEach((work,index) => {
            const article = create('article','work-case');
            article.id = `case-${work.id}`;
            const heading = create('div','work-case-heading');
            heading.append(create('span','work-number',`0${index+1}`));
            const identity = create('div','work-identity');
            identity.append(create('p','eyebrow',work.discipline),create('h3','',work.title),create('p','work-summary',work.summary));
            heading.append(identity,create('span','work-status',work.status));
            const meta = create('p','work-meta',`${work.role} · ${work.context} · ${work.period}`);
            const details = create('dl','work-case-details');
            [['El reto',work.challenge],['Mi aporte',work.contribution],['La entrega',work.outcome]].forEach(([title,text]) => {
                const group = create('div','');
                group.append(create('dt','',title),create('dd','',text));
                details.append(group);
            });
            const flow = create('ol','work-flow');
            flow.setAttribute('aria-label',`Recorrido de ${work.title}`);
            work.flow.forEach(step => flow.append(create('li','',step)));
            const stack = create('ul','tag-list');
            stack.setAttribute('aria-label',`Tecnologías de ${work.title}`);
            work.stack.forEach(technology => stack.append(create('li','',technology)));
            article.append(heading,meta,details,flow,stack);
            container.append(article);
        });
    });
})();
