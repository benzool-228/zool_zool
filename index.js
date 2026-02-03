const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <html><body>
      <h1>🤖 Bot WhatsApp Actif</h1>
      <p>${new Date().toLocaleString('fr-FR')}</p>
    </body></html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur sur port ${PORT}`);
});

async function startBot() {
  console.log('🚀 Démarrage...');
  
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: ['Bot', 'Chrome', '1.0']
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, qr } = update;
    
    if (qr) {
      console.log('\n📱 SCANNEZ CE QR:');
      qrcode.generate(qr, { small: true });
    }
    
    if (connection === 'open') {
      console.log('✅ CONNECTÉ !');
    }
  });

  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;
    
    const text = m.message.conversation || '';
    const sender = m.key.remoteJid;
    
    if (text === '.ping') {
      await sock.sendMessage(sender, { text: '🏓 Pong !' });
    }
    
    if (text === '.aide') {
      await sock.sendMessage(sender, { 
        text: '🤖 Commandes:\n.ping\n.aide' 
      });
    }
  });
}

startBot().catch(console.error);