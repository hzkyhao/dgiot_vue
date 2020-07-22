var datalist = [
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'id',
      'payload',
      'peerhost',
      'qos',
      'timestamp',
      'topic',
      'node'
    ],
    'description': {
      'en': 'message publish',
      'zh': '消息发布'
    },
    'event': 'message.publish',
    'sql_example': "SELECT payload.msg as msg FROM \"message.publish\" WHERE topic =~ 't/#' and msg = 'hello'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic': 't/a',
      'qos': 1,
      'payload': '{"msg": "hello"}'
    },
    'title': {
      'en': 'message publish',
      'zh': '消息发布'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'auth_result',
      'mountpoint',
      'id',
      'payload',
      'peerhost',
      'topic',
      'qos',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'message delivered',
      'zh': '消息投递'
    },
    'event': 'message.delivered',
    'sql_example': "SELECT payload.msg as msg FROM \"message.delivered\" WHERE topic =~ 't/#' and msg = 'hello'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic': 't/a',
      'qos': 1,
      'payload': '{"msg": "hello"}'
    },
    'title': {
      'en': 'message delivered',
      'zh': '消息投递'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'id',
      'payload',
      'peerhost',
      'topic',
      'qos',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'message acked',
      'zh': '消息应答'
    },
    'event': 'message.acked',
    'sql_example': "SELECT payload.msg as msg FROM \"message.acked\" WHERE topic =~ 't/#' and msg = 'hello'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic': 't/a',
      'qos': 1,
      'payload': '{"msg": "hello"}'
    },
    'title': {
      'en': 'message acked',
      'zh': '消息应答'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'id',
      'payload',
      'peerhost',
      'qos',
      'timestamp',
      'topic',
      'node'
    ],
    'description': {
      'en': 'message dropped',
      'zh': '消息丢弃'
    },
    'event': 'message.dropped',
    'sql_example': "SELECT payload.msg as msg FROM \"message.dropped\" WHERE topic =~ 't/#' and msg = 'hello'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic': 't/a',
      'qos': 1,
      'payload': '{"msg": "hello"}'
    },
    'title': {
      'en': 'message dropped',
      'zh': '消息丢弃'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'auth_result',
      'clean_start',
      'connack',
      'connected_at',
      'is_bridge',
      'keepalive',
      'mountpoint',
      'peerhost',
      'proto_ver',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'client connected',
      'zh': '连接建立'
    },
    'event': 'client.connected',
    'sql_example': 'SELECT * FROM "client.connected"',
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'auth_result': 'success',
      'peerhost': '127.0.0.1'
    },
    'title': {
      'en': 'client connected',
      'zh': '连接建立'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'auth_result',
      'mountpoint',
      'peerhost',
      'reason_code',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'client disconnected',
      'zh': '连接断开'
    },
    'event': 'client.disconnected',
    'sql_example': 'SELECT * FROM "client.disconnected"',
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'reason_code': 'normal'
    },
    'title': {
      'en': 'client disconnected',
      'zh': '连接断开'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'auth_result',
      'mountpoint',
      'peerhost',
      'topic_filters',
      'topic',
      'qos',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'client subscribe',
      'zh': '终端订阅'
    },
    'event': 'client.subscribe',
    'sql_example': "SELECT * FROM \"client.subscribe\" WHERE topic =~ 't/#'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic_filters': [
        {
          'topic': 't/a',
          'qos': 0
        },
        {
          'topic': 't/b',
          'qos': 1
        }
      ]
    },
    'title': {
      'en': 'client subscribe',
      'zh': '终端订阅'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'auth_result',
      'mountpoint',
      'peerhost',
      'topic_filters',
      'topic',
      'qos',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'client unsubscribe',
      'zh': '终端取消订阅'
    },
    'event': 'client.unsubscribe',
    'sql_example': "SELECT * FROM \"client.unsubscribe\" WHERE topic =~ 't/#'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic_filters': [
        't/a',
        't/b'
      ]
    },
    'title': {
      'en': 'client unsubscribe',
      'zh': '终端取消订阅'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'topic',
      'qos',
      'nl',
      'rap',
      'rc',
      'rh',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'session subscribed',
      'zh': '会话订阅完成'
    },
    'event': 'session.subscribed',
    'sql_example': "SELECT * FROM \"session.subscribed\" WHERE topic =~ 't/#'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic': 't/a',
      'qos': 1
    },
    'title': {
      'en': 'session subscribed',
      'zh': '会话订阅完成'
    }
  },
  {
    'columns': [
      'clientid',
      'username',
      'event',
      'topic',
      'qos',
      'nl',
      'rap',
      'rc',
      'rh',
      'timestamp',
      'node'
    ],
    'description': {
      'en': 'session unsubscribed',
      'zh': '会话取消订阅完成'
    },
    'event': 'session.unsubscribed',
    'sql_example': "SELECT * FROM \"session.unsubscribed\" WHERE topic =~ 't/#'",
    'test_columns': {
      'clientid': 'c_emqx',
      'username': 'u_emqx',
      'topic': 't/a',
      'qos': 1
    },
    'title': {
      'en': 'session unsubscribed',
      'zh': '会话取消订阅完成'
    }
  }
]
export default datalist
