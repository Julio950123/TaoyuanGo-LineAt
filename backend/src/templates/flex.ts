// Flex Message templates for LINE
// Using plain objects to avoid LINE SDK type conflicts between v9 internal modules

export function newsFlexMessage(items: any[]) {
  const bubbles = items.slice(0, 10).map(item => ({
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box', layout: 'vertical',
      contents: [{ type: 'text', text: item.type === 'winner' ? '🎉 中獎名單' : '📢 活動資訊', size: 'xs', color: '#888888' }]
    },
    body: {
      type: 'box', layout: 'vertical', spacing: 'sm',
      contents: [
        { type: 'text', text: item.title, weight: 'bold', size: 'md', wrap: true },
        { type: 'text', text: (item.content || '').substring(0, 60) + '…', size: 'sm', color: '#666666', wrap: true }
      ]
    }
  }));

  return {
    type: 'flex', altText: '最新消息',
    contents: { type: 'carousel', contents: bubbles }
  };
}

export function storeFlexMessage(stores: any[], moreUrl: string) {
  const bubbles: any[] = stores.slice(0, 9).map(store => ({
    type: 'bubble',
    size: 'kilo',
    ...(store.image_url ? { hero: { type: 'image', url: store.image_url, size: 'full', aspectRatio: '4:3', aspectMode: 'cover' } } : {}),
    body: {
      type: 'box', layout: 'vertical', spacing: 'sm',
      contents: [
        { type: 'text', text: store.name, weight: 'bold', size: 'md' },
        { type: 'text', text: store.description || '', size: 'sm', color: '#666666', wrap: true, maxLines: 2 }
      ]
    },
    ...(store.website_url ? { footer: { type: 'box', layout: 'vertical', contents: [{ type: 'button', action: { type: 'uri', label: '查看詳情', uri: store.website_url }, style: 'primary', height: 'sm' }] } } : {})
  }));

  bubbles.push({
    type: 'bubble', size: 'kilo',
    body: {
      type: 'box', layout: 'vertical', justifyContent: 'center', alignItems: 'center',
      contents: [{ type: 'button', action: { type: 'uri', label: '更多商家', uri: moreUrl }, style: 'primary' }] as any[]
    }
  });

  return {
    type: 'flex', altText: '合作店家',
    contents: { type: 'carousel', contents: bubbles }
  };
}

export function offersFlexMessage(offers: any[]) {
  const bubbles = offers.slice(0, 10).map(offer => ({
    type: 'bubble',
    size: 'kilo',
    ...(offer.image_url ? { hero: { type: 'image', url: offer.image_url, size: 'full', aspectRatio: '4:3', aspectMode: 'cover' } } : {}),
    body: {
      type: 'box', layout: 'vertical', spacing: 'sm',
      contents: [
        { type: 'text', text: offer.title, weight: 'bold', size: 'md', wrap: true },
        { type: 'text', text: offer.description || '', size: 'sm', color: '#666666', wrap: true, maxLines: 3 }
      ]
    }
  }));

  return {
    type: 'flex', altText: '店家優惠',
    contents: { type: 'carousel', contents: bubbles }
  };
}

export function writerFlexMessage(writers: any[]) {
  const bubbles = writers.slice(0, 10).map(writer => ({
    type: 'bubble',
    size: 'kilo',
    ...(writer.avatar_url ? { hero: { type: 'image', url: writer.avatar_url, size: 'full', aspectRatio: '1:1', aspectMode: 'cover' } } : {}),
    body: {
      type: 'box', layout: 'vertical', spacing: 'sm',
      contents: [
        { type: 'text', text: writer.name, weight: 'bold', size: 'md', align: 'center' },
        { type: 'text', text: writer.bio || '', size: 'sm', color: '#666666', wrap: true, align: 'center' }
      ]
    },
    footer: {
      type: 'box', layout: 'vertical',
      contents: [{ type: 'button', action: { type: 'uri', label: '閱讀文章', uri: writer.link_url }, style: 'primary', height: 'sm' }]
    }
  }));

  return {
    type: 'flex', altText: '好文推薦',
    contents: { type: 'carousel', contents: bubbles }
  };
}
