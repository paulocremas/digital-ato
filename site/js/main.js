import { initShader } from './shader.js';
import { initRepoExplorer } from './github.js';
import { createNegativeFavicon } from './favicon.js';
import { setupDraggable } from './ui.js';

// Configurações
const DRIVE_ID = '1AtJ6HZc5qK5NvDKS4VG_Pop7iDZhL0SI';
const GH_USER = 'paulocremas';
const GH_REPO = 'digital-ato';

// Inicialização
createNegativeFavicon(DRIVE_ID);
initShader('glCanvas');
initRepoExplorer(GH_USER, GH_REPO);
setupDraggable('strudel-container', 'strudel-header');
