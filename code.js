figma.showUI(__html__, {
  width: 660,
  height: 560,
  title: 'Variable Code Syntax'
});

async function loadData() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const result = [];

  for (const col of collections) {
    const vars = [];
    for (const id of col.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(id);
      if (v) {
        vars.push({
          id: v.id,
          name: v.name,
          resolvedType: v.resolvedType,
          codeSyntax: v.codeSyntax || {}
        });
      }
    }
    result.push({ id: col.id, name: col.name, variables: vars });
  }

  return result;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'INIT') {
    try {
      const collections = await loadData();
      figma.ui.postMessage({ type: 'DATA', collections });
    } catch (err) {
      figma.ui.postMessage({ type: 'ERROR', message: String(err) });
    }
  }

  if (msg.type === 'APPLY') {
    try {
      let count = 0;
      for (const change of msg.changes) {
        const v = await figma.variables.getVariableByIdAsync(change.id);
        if (!v) continue;
        v.setVariableCodeSyntax(change.platform, change.value);
        count++;
      }
      figma.ui.postMessage({ type: 'DONE', count });
    } catch (err) {
      figma.ui.postMessage({ type: 'ERROR', message: String(err) });
    }
  }
};
