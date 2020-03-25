
    series: [
    {
        name: '安装数',
        type: 'bar',
        // barWidth: 15,
        // barGap: '-10%',
        data: data.yArray,
        markPoint: {
            data: [
                {name: '最高'},
                {name: '最低'}
            ]
        },
        itemStyle: {
            color: function (params) {
                // build a color map as your need.
                var colorList = [
                    '#00C47B', '#FF894A', '#8782F7', '#24A8BF', '#1CCCB5',
                    '#158EFE', '#68B671', '#FEDB65', '#2CD1C0', '#AE54B5',
                    '#FF80AA', '#F8568C', '#C71848', '#F61B63', '#7ED321'
                ];
                return colorList[params.dataIndex]
            }
        },
        animationDelay: function (idx) {
            return idx * 10 + 100;
        }
    }
]