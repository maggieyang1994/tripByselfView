<template>
   <div class="analysisWrapper">
     <div class="title">
       <h2>数据分析</h2>
       <p class="colorBlue">最近七天内，2种行程，8种出行方式的里程趋势折线图</p>
     </div>

    <div>
        <!-- 公共交通 -->
      <y-echart :options = "trafficOption" container="echart1"></y-echart>
     <!-- 私人出行 
      <y-echar
      t :options = "tripOptions" container="echart1"></y-echart>-->
    </div>
     
   </div>
</template>
<script>
export default {
  name: "analysis",
  data() {
    return {
      trafficOption: {}
    };
  },
  mounted() {
    this.$store.dispatch("setTrips");
  },
  watch: {
    list(newV) {
      if (newV.length) {
        let trafficLegend = this.getLegend("traffic");
        let trafficData = this.getSeriesData(newV, trafficLegend, "traffic");
        let trafficSeries = this.getSeries(trafficData, "公共交通");
        this.trafficOption = this.getOptions(
          "出行方式分布图",
          trafficLegend,
          trafficSeries
        );
      }
    }
  },
  computed: {
    list() {
      return this.$store.state.totalTrips;
    }
  },
  methods: {
    getOptions(title, legend, series) {
      return {
        title: {
          text: title,
          textAlign: 'right',
          x: "right"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: legend
        },
        series: series
      };
    },
    getSeries(data, serriesName) {
      let temp = [
        {
          name: serriesName,
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ];

      return temp;
    },
    getLegend(type) {
      return [
        ...new Set(this.list.filter(x => x.type === type).map(x => x.tripType))
      ];
    },
    getSeriesData(list, trafficLegend, type) {
      return trafficLegend.reduce((o, item) => {
        o.push({
          name: item,
          value: list.filter(x => x.type === type && x.tripType === item).length
        });
        return o;
      }, []);
    }
  }
};
</script>
s

