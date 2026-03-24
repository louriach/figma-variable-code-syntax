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
    const succeeded = [];

    for (const change of msg.changes) {
      try {
        const v = await figma.variables.getVariableByIdAsync(change.id);
        if (!v) {
          errors.push({ id: change.id, name: change.id, platform: change.platform, reason: 'Variable not found' });
          continue;
        }

        if (change.value === '') {
          if (typeof v.removeVariableCodeSyntax === 'function') {
            v.removeVariableCodeSyntax(change.platform);
          } else {
            errors.push({ id: change.id, name: v.name, platform: change.platform, reason: 'This version of Figma does not support removing syntax' });
            continue;
          }
        } else {
          v.setVariableCodeSyntax(change.platform, change.value);
        }

        succeeded.push({ id: change.id, platform: change.platform, value: change.value });
        applied++;
      } catch (err) {
        errors.push({ id: change.id, name: change.id, platform: change.platform, reason: String(err) });
      }
    }

    figma.ui.postMessage({ type: 'DONE', count: applied, errors, succeeded });
  }
};
