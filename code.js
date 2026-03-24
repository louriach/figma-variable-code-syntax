figma.showUI(__html__, {
  width: 780,
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
    let applied = 0;
    const errors = [];

    for (const change of msg.changes) {
      // Figma does not accept empty strings — skip clears
      if (!change.value) continue;

      try {
        const v = await figma.variables.getVariableByIdAsync(change.id);
        if (!v) {
          errors.push({ name: change.id, platform: change.platform, reason: 'Variable not found' });
          continue;
        }
        v.setVariableCodeSyntax(change.platform, change.value);
        applied++;
      } catch (err) {
        errors.push({ name: change.id, platform: change.platform, reason: String(err) });
      }
    }

    figma.ui.postMessage({ type: 'DONE', count: applied, errors });
  }
};
