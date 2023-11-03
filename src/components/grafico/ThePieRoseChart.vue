<template>
  <div style="max-width: 100%;" class="chartComponent">
    <div ref="chart" style="height: 400px; min-width: 0;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ThePieChart',

  props: {
    data: Array,
  },

  mounted() {
    this.chart = echarts.init(this.$refs.chart)

    const container = document.querySelector('.chartComponent');

    new ResizeObserver(() => this.chart.resize()).observe(container);

    this.updateChart();
  },

  methods: {
    updateChart() {
      const option = {
        legend: {
          top: 'bottom'
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [30, 150],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.data
          }
        ]
      };
      this.chart.setOption(option);
    },
  },

  watch: {
    data() {
      console.log(this.data)
      this.updateChart();
    }
  },

  beforeUnmount() {
    this.chart.dispose()
  },
}
</script>
