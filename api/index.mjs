export default async (req, res) => {
  console.log('URL:', req.url);

  try {
    const mod = await import('../dist/fuse/server/server.mjs');
    console.log('Exports:', Object.keys(mod));

    return mod.reqHandler(req, res);
  } catch (e) {
    console.error(e);
    res.status(500).send(String(e.stack || e));
  }
};