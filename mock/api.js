import { parse } from 'url';

const titles = [
  'That Greece Might Still Be Free: The Philhellenes in the War of Independence',
  'The Altering Eye: Contemporary International Cinema',
  'Brownshirt Princess: A Study of the \'Nazi Conscience\'',
  'Telling Tales: The Impact of Germany on English Children’s Books 1780-1918',
  'Coleridge\'s Laws: A Study of Coleridge in Malta',
  'The End and the Beginning: The Book of My Life',
  'Peace and Democratic Society',
];

const types = [
  'monograph',
  'monograph',
  'book',
  'monograph',
  'monograph',
  'monograph',
  'book-chapter',
  'monograph',
];

const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const desc = [
  'info:doi:10.11647/obp.0001; urn:isbn:9781906924003; urn:isbn:9781906924010; urn:isbn:9781906924027; urn:isbn:9781906924027epub; urn:isbn:9781906924027mobi; uhttp://books.openedition.org/obp/669; http://www.openbookpublishers.com/product/3',
  'info:doi:10.11647/obp.0002; urn:isbn:9781906924034; urn:isbn:9781906924041',
  'info:doi:10.11647/obp.0003; urn:isbn:9781906924065; urn:isbn:9781906924072',
  'info:doi:10.11647/obp.0004; urn:isbn:9781906924096; urn:isbn:9781906924119',
  'info:doi:10.11647/obp.0005; urn:isbn:9781906924126; urn:isbn:9781906924133',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

export function works(count) {
  const publication = [];
  for (let i = 0; i < count; i += 1) {
    publication.push({
      id: `fake-publication-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      type: types[i % 8],
      description: desc[i % 8],
    });
  }

  return publication;
}

export function getWorks(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const count = params.count * 1 || 20;

  const result = works(count);

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getWorks,
};
