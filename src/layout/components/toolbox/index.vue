<template>
  <div>
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" @click="toolbox">
      <path d="M904 260H736v-56c0-30.9-25.1-56-56-56H344c-30.9 0-56 25.1-56 56v56H120c-30.9 0-56 25.1-56 56v504c0 30.9 25.1 56 56 56h784c30.9 0 56-25.1 56-56V316c0-30.9-25.1-56-56-56z m-560-56h336v56H344v-56z m560 616H120V596h308v28c0 30.9 25.1 56 56 56h56c30.9 0 56-25.1 56-56v-28h308v224zM484 624V512h56v112h-56z m112-84v-28c0-30.9-25.1-56-56-56h-56c-30.9 0-56 25.1-56 56v28H120V316h784v224H596z" fill="#515151"></path>
    </svg>
    <el-drawer size="280px" :visible="visible" :with-header="false" :before-close="close" :append-to-body="true" :show-close="false">
      <div class="drawer-container">
        <el-row>
          <el-col>
            <div @click="svgEdit">
              <el-card shadow="hover" :body-style="{ padding: '0px',display: 'flex' }">
                <div class="image">
                  <svg viewBox="0 0 16 16" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-.1 16.1L16 .04V16.1H-.1z" fill="#ccc"></path>
                    <path d="M0 16.1V.1l16 16H0z" fill="#666"></path>
                  </svg>
                </div>
                <div style="padding: 14px;width: 60%;">
                  <b>SVG-Edit</b>
                  <div class="clearfix">
                    <span>SVG在线编辑器</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col>
            <div @click="drawio">
              <el-card shadow="hover" :body-style="{ padding: '0px',display: 'flex' }">
                <div class="image">
                  <svg-icon icon-class="drawio" style="width: 60px;height: 60px;"/>
                </div>
                <div style="padding: 14px;width: 60%;">
                  <b>drawio</b>
                  <div class="clearfix">
                    <span>流程图绘制工具</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col>
            <div @click="miniPaint">
              <el-card shadow="hover" :body-style="{ padding: '0px',display: 'flex' }">
                <div class="image">
                  <svg-icon icon-class="miniPaint" style="width: 60px;height: 60px;"/>
                </div>
                <div style="padding: 14px;width: 60%;">
                  <b>在线 PS 工具</b>
                  <div class="clearfix">
                    <span>在线 PS 工具</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col>
            <div @click="pdfeditor">
              <el-card shadow="hover" :body-style="{ padding: '0px',display: 'flex' }">
                <div class="image">
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                    <path d="M0 64a64 64 0 0 1 64-64h896a64 64 0 0 1 64 64v896a64 64 0 0 1-64 64H64a64 64 0 0 1-64-64V64z m801.696 519.264c-14.144-23.744-51.808-33.28-108.384-33.28-18.848 0-37.696 4.768-61.248 4.768a331.264 331.264 0 0 1-43.072-29.024l0.672 0.512a343.424 343.424 0 0 1-74.624-121.056l-0.736-2.4v-4.704c18.848-61.792 32.96-137.728 0-171.008a66.432 66.432 0 0 0-27.968-9.44l-0.288-0.032h-9.376c-18.848 0-32.96 19.04-37.696 37.984-18.848 66.464-9.376 99.744 9.376 156.736a995.52 995.52 0 0 1-54.432 143.84l2.624-6.176c-18.848 33.28-32.96 61.76-47.104 85.504-18.848 9.472-32.96 18.944-42.4 23.712-56.512 33.28-84.8 75.936-89.504 99.744a42.624 42.624 0 0 0 4.832 23.968l-0.128-0.224v4.768l23.552 14.176c4.704 4.768 9.408 4.768 18.848 4.768 37.696 0 84.8-47.456 141.312-147.2a9.376 9.376 0 0 1 9.472-4.736h-0.064c47.104-18.944 108.352-28.416 188.416-37.984a331.2 331.2 0 0 0 141.056 33.28h0.256c14.656 0.192 29.184-3.072 42.4-9.472 9.376-9.568 14.144-23.808 18.848-28.512a60.608 60.608 0 0 0-4.8-28.864l0.16 0.384zM250.56 763.648c4.704-14.24 28.256-47.456 61.248-75.936 7.168-5.792 15.104-10.592 23.552-14.272-28.256 57.024-56.512 85.504-84.8 90.208z m226.176-522.336h0.096c2.56 0 4.608-2.048 4.608-4.608v-0.064l4.704 4.672v4.8c4.704 4.768 4.704 23.712 0 47.424v9.568c0 14.24-4.704 23.712-9.408 42.752-9.472-42.752-9.472-76.032-0.064-104.544z m-61.248 379.904h-9.472c9.408-19.008 18.848-33.28 28.256-52.224 18.848-42.752 37.696-80.704 47.104-113.984a484.672 484.672 0 0 0 70.656 109.216c5.376 5.824 11.776 10.688 18.848 14.24a715.712 715.712 0 0 0-155.488 42.752z m357.984-9.472h-14.176c-23.552 0-56.512-9.536-89.504-23.808v-4.672h9.376c65.952 0 84.8 14.24 89.504 18.944v0.16c0 2.56 2.048 4.608 4.608 4.608h0.096v4.768h0.096z" fill="#EE6363"></path>
                  </svg>
                </div>
                <div style="padding: 14px;width: 60%;">
                  <b>PDF在线编辑器</b>
                  <div class="clearfix">
                    <span>PDF在线编辑器</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col>
            <div @click="desmos">
              <el-card shadow="hover" :body-style="{ padding: '0px',display: 'flex' }">
                <div class="image">
                  <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 450 450">
                    <g transform="translate(0,450) scale(0.100000,-0.100000)" fill="#43CD80" stroke="none">
                      <path d="M903 4395 c-81 -13 -121 -23 -199 -51 l-42 -15 34 -127 c18 -70 58
                      -215 89 -322 32 -107 63 -217 70 -245 18 -65 176 -551 222 -680 105 -297 227
                      -595 289 -711 24 -44 44 -87 44 -95 0 -8 -18 -27 -40 -44 -23 -16 -74 -64
                      -116 -107 -41 -43 -79 -78 -83 -78 -9 0 -147 310 -215 480 -145 369 -346 953
                      -451 1313 -25 88 -51 166 -56 175 -6 10 -25 68 -43 130 l-32 113 -40 -43
                      c-105 -114 -182 -272 -213 -438 -25 -131 -31 -321 -31 -937 l0 -652 178 -178
                      c201 -203 270 -260 362 -306 54 -27 76 -32 135 -32 59 0 81 5 136 32 66 33
                      113 73 445 387 227 214 336 274 514 283 118 7 190 -10 317 -73 122 -61 205
                      -131 363 -302 219 -237 334 -320 455 -330 138 -11 218 41 505 325 267 264 342
                      319 488 363 63 19 90 22 185 18 107 -5 125 -9 230 -53 18 -7 18 17 14 651 -3
                      557 -6 674 -20 759 -39 230 -120 389 -276 538 -65 63 -91 75 -91 44 0 -38
                      -194 -697 -312 -1057 -175 -534 -462 -1215 -577 -1370 -11 -14 -35 -51 -55
                      -82 -32 -52 -39 -58 -70 -58 -40 0 -156 57 -209 103 l-39 34 46 72 c55 86 214
                      401 281 556 26 61 51 115 55 120 9 11 115 282 167 425 69 190 223 671 291 910
                      60 208 142 511 142 524 0 4 -92 23 -180 36 -104 16 -2564 11 -2667 -5z"/>
                      <path d="M4092 1924 c-36 -7 -86 -27 -115 -46 -29 -18 -160 -138 -292 -267
                      -132 -128 -266 -251 -298 -273 -213 -144 -422 -161 -640 -52 -98 49 -123 69
                      -312 255 -349 342 -415 389 -541 389 -64 0 -137 -26 -196 -69 -24 -18 -112
                      -98 -195 -179 -335 -323 -391 -369 -518 -421 -170 -71 -328 -61 -514 34 -84
                      42 -113 65 -262 205 l-122 115 6 -340 c5 -276 10 -359 25 -440 38 -195 113
                      -339 255 -484 145 -148 296 -226 522 -269 82 -15 204 -17 1360 -17 1156 0
                      1278 2 1360 17 225 43 378 122 522 269 94 97 157 190 199 294 68 167 84 323
                      84 812 l0 352 -37 31 c-47 39 -147 87 -193 93 -19 2 -64 -2 -98 -9z m-2386
                      -271 c51 -76 247 -273 304 -306 123 -71 239 -72 371 -5 43 22 84 38 91 34 7
                      -3 42 -31 78 -61 36 -30 89 -67 117 -82 29 -16 53 -31 53 -35 0 -15 -121 -101
                      -195 -138 -204 -103 -425 -106 -616 -9 -107 54 -180 108 -284 213 -88 88 -185
                      211 -185 233 0 12 204 213 216 213 6 0 28 -26 50 -57z"/>
                    </g>
                  </svg>
                </div>
                <div style="padding: 14px;width: 60%;">
                  <b>Desmos</b>
                  <div class="clearfix">
                    <span>在线函数图形机算器</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
          <el-col>
            <div @click="autodraw">
              <el-card shadow="hover" :body-style="{ padding: '0px',display: 'flex' }">
                <div class="image">
                  <svg-icon icon-class="autodraw" style="width: 60px;height: 60px;"/>
                </div>
                <div style="padding: 14px;width: 60%;">
                  <b>Autodraw</b>
                  <div class="clearfix">
                    <span>人工智能画画平台</span>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>

      </div>
    </el-drawer>
  </div>
</template>

<script>

export default {
  components: {  },
  data() {
    return {
      visible: false
    };
  },
  computed: {

  },
  methods: {
    close() {
      this.visible = false;
    },
    toolbox() {
      this.visible = true;
    },
    svgEdit() {
      window.open(window.location.origin + '/Method-Draw')
    },
    drawio() {
      window.open(window.location.origin + '/CherryMarkdown/drawio_demo.html')
    },
    miniPaint() {
      window.open('https://c.runoob.com/more/imageeditor/')
    },
    pdfeditor() {
      window.open('https://c.runoob.com/more/pdfeditor/')
    },
    desmos() {
      window.open('https://www.desmos.com/calculator?lang=zh-CN')
    },
    autodraw() {
      window.open('https://www.autodraw.com/')
    },
  }
}
</script>

<style lang="scss" scoped>
  .drawer-container {
    height: 100%;
    padding: 20px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    background-color: rgb(255, 255, 255);

  }
  .image {
    width: 30%;
    display: flex;
    margin:auto;
  }
  .clearfix {
    margin-top: 5px;
    font-size: 10px;
  }
</style>
