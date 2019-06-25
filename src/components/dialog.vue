  <template>
    <el-dialog
    :title="dialogMap.title"
    :visible.sync="dialogVisible"
    :width="dialogMap.width || '30%'"
    :style="{backgroundColor: dialogMap.type === 'info' ? '#409eff': 'ff3333'}"
   >
    <span>{{dialogMap.message}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{dialogMap.cancelText || '取消'}}</el-button>
      <el-button type="primary" @click="dialogVisible = false">{{dialogMap.confirmText || '确定'}}</el-button>
    </span>
    </el-dialog>
</template>
<script>
export default {
  name: 'y-dialog',
  props: {
    dialogType: {
      type: String,
      require: true
    }
  },
  computed: {
    dialogMap(){
      return this.$store.state.dialogMap
    },
    dialogVisible: {
      get(){
        return !!Object.keys(this.dialogMap).length
      },
      set(value){
        this.$store.state.commit("setDialogMap", {})
      }
    }
  },
  data(){
    return {
      // dialogVisible: false
    }
  }
}
</script>

