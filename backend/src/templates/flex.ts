// Flex Message templates for LINE

export function newsFlexMessage(news: any[], moreUrl: string) {
  const bubbles: any[] = news.slice(0, 9).map(item => {
    const bubble: any = {
      type: 'bubble',
      size: 'mega',
      ...(item.image_url ? {
        hero: {
          type: 'image',
          url: item.image_url,
          size: 'full',
          aspectRatio: '6:5',
          aspectMode: 'cover',
        }
      } : {}),
      body: {
        type: 'box', layout: 'vertical', spacing: 'sm', paddingAll: '20px',
        contents: [
          {
            type: 'box', layout: 'horizontal', contents: [
              { type: 'text', text: item.type === 'winner' ? '中獎名單' : '活動資訊', size: 'xs', color: '#ffffff', weight: 'bold' }
            ],
            backgroundColor: item.type === 'winner' ? '#FF6B6B' : '#4fc3f7',
            paddingAll: '4px', paddingStart: '10px', paddingEnd: '10px',
            cornerRadius: 'md', width: '72px',
          },
          { type: 'text', text: item.title, weight: 'bold', size: 'lg', wrap: true, margin: 'md' },
        ]
      }
    };
    return bubble;
  });

  bubbles.push({
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box', layout: 'vertical', justifyContent: 'center', alignItems: 'center', paddingAll: '40px',
      contents: [
        { type: 'text', text: '查看全部消息', weight: 'bold', size: 'lg', align: 'center' },
        { type: 'text', text: '點擊查看更多活動資訊', size: 'sm', color: '#999999', align: 'center', margin: 'md' },
        {
          type: 'button',
          action: { type: 'uri', label: '查看更多', uri: moreUrl },
          style: 'primary',
          height: 'sm',
          margin: 'xl',
          color: '#4fc3f7'
        }
      ]
    }
  });

  return {
    type: 'flex', altText: '最新消息',
    contents: { type: 'carousel', contents: bubbles }
  };
}

export function storeFlexMessage(stores: any[], moreUrl: string) {
  const bubbles: any[] = stores.slice(0, 9).map(store => {
    const bubble: any = {
      type: 'bubble',
      size: 'mega',
      ...(store.image_url ? {
        hero: {
          type: 'image',
          url: store.image_url,
          size: 'full',
          aspectRatio: '3:2',
          aspectMode: 'cover',
        }
      } : {}),
      body: {
        type: 'box', layout: 'vertical', spacing: 'sm', paddingAll: '20px',
        contents: [
          { type: 'text', text: store.name, weight: 'bold', size: 'lg', wrap: true },
          { type: 'text', text: store.address || '', size: 'xs', color: '#888888', wrap: true, margin: 'md' },
          { type: 'text', text: `營業時間：${store.business_hours || '未提供'}`, size: 'xs', color: '#888888', wrap: true, margin: 'sm' },
        ]
      },
    };
    if (store.website_url) {
      bubble.footer = {
        type: 'box', layout: 'vertical', paddingAll: '12px',
        contents: [{
          type: 'button',
          action: { type: 'uri', label: store.button_text || '查看詳情', uri: store.website_url },
          style: 'link',
          height: 'sm',
          color: '#1a73e8',
        }]
      };
    }
    return bubble;
  });

  bubbles.push({
    type: 'bubble',
    size: 'mega',
    body: {
      type: 'box', layout: 'vertical', justifyContent: 'center', alignItems: 'center', paddingAll: '40px',
      contents: [
        { type: 'text', text: '更多合作商家', weight: 'bold', size: 'lg', align: 'center' },
        { type: 'text', text: '點擊查看所有合作店家', size: 'sm', color: '#999999', align: 'center', margin: 'md' },
        {
          type: 'button',
          action: { type: 'uri', label: '查看更多', uri: moreUrl },
          style: 'primary',
          height: 'sm',
          margin: 'xl',
          color: '#66bb6a'
        }
      ]
    }
  });

  return {
    type: 'flex', altText: '合作店家',
    contents: { type: 'carousel', contents: bubbles }
  };
}

export function writerFlexMessage(writers: any[]) {
  const bubbles: any[] = writers.slice(0, 10).map(writer => ({
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box', layout: 'vertical', spacing: 'md', alignItems: 'center', paddingAll: '20px',
      contents: [
        // 圓形大頭貼
        ...(writer.avatar_url ? [{
          type: 'image', url: writer.avatar_url, size: '80px',
          aspectRatio: '1:1', aspectMode: 'cover'
        }] : []),
        // 名稱
        { type: 'text', text: writer.name, weight: 'bold', size: 'md', align: 'center', margin: 'md' },
        // 品牌（如有）
        ...(writer.brand ? [{ type: 'text', text: writer.brand, size: 'xs', color: '#888888', align: 'center' }] : []),
        // 簡介
        { type: 'text', text: writer.bio || '', size: 'sm', color: '#555555', wrap: true, align: 'center', margin: 'md' },
        // 白底藍字按鈕
        {
          type: 'button',
          action: { type: 'uri', label: '閱讀文章', uri: writer.link_url },
          style: 'link',
          height: 'sm',
          margin: 'lg',
          color: '#1a73e8'
        }
      ]
    }
  }));

  return {
    type: 'flex', altText: '好文推薦',
    contents: { type: 'carousel', contents: bubbles }
  };
}
