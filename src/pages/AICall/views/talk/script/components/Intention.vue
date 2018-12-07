<template>
  <div class="intention">
    <div v-for="(intentionItem,idx) in intentionType" :key="`intention-${idx}`" class="intention-item">
      <el-form-item class="intention__type script-form-item"
          label="意向性"
          :prop="`intentionType[${idx}].type`"
          :rules="intentionRules.type"
      >
        <el-select v-model="intentionItem.type" clearable>
            <el-option v-for="intention in ['A','B','C','D', 'G', 'H', 'I']" :key="intention" :label="`${intention}类意向性`" :value="intention"/>
        </el-select>
        <el-button icon='el-icon-minus' @click="handleIntentionType(-1,idx)" v-if="idx!==0" class="button__del"/>
      </el-form-item>

      <template v-if="intentionItem.type">
        <el-form-item label="包含关键词"
          :prop="`intentionType[${idx}].inKeywords`"
          :rules="intentionRules.keyword"
          class="script-form-item"
        >
          <lazy-load-select
              v-model="intentionItem.inKeywords"
              placeholder="请选择关键词"
              listKey = "clusters"
              :loadList = "loadClusters"
              :defalut-opt="intentionItem.inKeywordsOpt"
              :disabled-opt="intentionItem.outKeywords"
              disabled-tip="不能添加相同的关键词"
              size="medium"
              multiple
              :multiple-limit = "10"
              class="select-keywords"
          >
          </lazy-load-select>
          <el-input v-model="intentionItem.num" placeholder="命中个数" v-number-only class="intention__num error__disabled"/>
        </el-form-item>
        <el-form-item label="不包含关键词">
          <lazy-load-select
              v-model="intentionItem.outKeywords"
              placeholder="请选择不包含关键词"
              listKey = "clusters"
              :loadList = "loadClusters"
              :defalut-opt="intentionItem.outKeywordsOpt"
              :disabled-opt="intentionItem.inKeywords"
              disabled-tip="不能添加相同的关键词"
              size="medium"
              multiple
              :multiple-limit = "10"
              class="select-keywords"
          >
          </lazy-load-select>
        </el-form-item>
        <el-form-item label="会话轮数"
          :prop="`intentionType[${idx}].sessionNum`"
          :rules="intentionRules.round"
        >
          <el-select v-model="intentionItem.sessionNum" clearable placeholder="请选择">
            <el-option v-for="i in 20" :key="i" :label="i" :value="i"/>
          </el-select>
        </el-form-item>
        <el-form-item label="通话时间"
          :prop="`intentionType[${idx}].duration`"
          :rules="intentionRules.duration"
          class="duration-area"
          ref="durationArea"
        >
          <el-select clearable
            v-model="intentionItem.duration.type"
            @change="resetDuration(idx)"
            class="error__disabled"
          >
            <el-option label="区间" :value="0"/>
            <el-option label="大于" :value="1"/>
            <el-option label="小于" :value="-1"/>
          </el-select>
          <div
            v-if="intentionItem.duration.type === 0"
            class="el-duration-range el-date-editor el-range-editor el-input__inner el-date-editor--timerange"
          >
            <el-input placeholder="请输入秒数" class="el-range-input" v-model="intentionItem.duration.area[0]" v-number-only/>
            <span class="el-range-separation">—</span>
            <el-input placeholder="请输入秒数" class="el-range-input" v-model="intentionItem.duration.area[1]" v-number-only/>
          </div>
          <el-input
            v-if="intentionItem.duration.type === 1"
            v-model="intentionItem.duration.area[0]"
            v-number-only
            placeholder="请输入秒数"
            class="el-duration-range"/>
          <el-input
            v-if="intentionItem.duration.type === -1"
            v-model="intentionItem.duration.area[1]"
            v-number-only
            placeholder="请输入秒数"
            class="el-duration-range"/>
        </el-form-item>
      </template>
    </div>
    <el-form-item v-if="intentionType.length !== 4" style="margin: 30px 0;">
      <el-button type="primary" icon='el-icon-circle-plus-outline' plain @click="handleIntentionType(1)">增加意向性</el-button>
    </el-form-item>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Intention',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value: {
      handler (val) {
        val.map(item => {
          item.inKeywordsOpt = Array.from(item.inKeywords, key => this.clustersList.find(cluster => cluster.id === key))
          item.outKeywordsOpt = Array.from(item.outKeywords, key => this.clustersList.find(cluster => cluster.id === key))
        })
        this.intentionType = val
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      clustersList: 'AICall/clustersList'
    })
    // selectedKey () {
    //   const intentionType = this.intentionType
    //   const flattenArr = (arr) => arr.reduce((a, b) => [...a, ...b])
    //   const allKeys = flattenArr(Array.of(flattenArr(Array.from(intentionType, x => x.inKeywords)), flattenArr(Array.from(intentionType, x => x.outKeywords))))
    //   return allKeys
    // }
  },
  data () {
    const checkUnique = (type, key) => {
      return (rule, value, callback) => {
        const map = {}
        if (value) {
          for (const d of this.intentionType) {
            if (map[d[type]] === value) {
              return callback(new Error(`已存在该${key}，请重新选择`))
            } else {
              map[d[type]] = d[type]
            }
          }
        }
        callback()
      }
    }
    const checkIntentionDuration = (rule, value, callback) => {
      if (value.type === 0) {
        const [start, end] = value.area
        if (!start) return callback(new Error('请输入开始时间'))
        if (!end) return callback(new Error('请输入结束时间'))
        if (+start > +end) return callback(new Error('结束时间不得早于开始时间'))
      }
      callback()
    }
    return {
      intentionType: this.value,
      intentionRules: {
        type: {
          validator: checkUnique('type', '意向性'), trigger: 'change'
        },
        round: {
          validator: checkUnique('sessionNum', '会话轮数'), trigger: 'change'
        },
        keyword: {
          required: true, message: '请添加关键词', trigger: 'none'
        },
        duration: {
          validator: checkIntentionDuration, trigger: 'none'
        }
      }
    }
  },
  methods: {
    ...mapActions({
      loadClusters: 'AICall/loadClusters'
    }),
    selectedKey (inedx) {
      const intentionType = this.intentionType[inedx]
      const allKeys = intentionType.inKeywords.concat(intentionType.outKeywords)
      return allKeys
    },
    handleIntentionType (type, idx) {
      console.log(this.intentionType)
      switch (type) {
        case 1:
          if (this.intentionType.length < 4) {
            this.intentionType.push(
              {
                type: '',
                inKeywords: [],
                num: '',
                outKeywords: [],
                sessionNum: '',
                duration: {
                  type: '',
                  area: ['', '']
                }
              }
            )
          }
          break
        case -1:
          this.intentionType.splice(idx, 1)
          break
      }
    },
    resetDuration (idx) {
      this.intentionType[idx].duration.area = ['', '']
      this.$refs['durationArea'][idx].clearValidate()
    }
  }
}
</script>
