<template>
    <q-card class="bg-transparent no-shadow full-width" style="height: 10%">
        <q-card-section>
          <div class="center">
            <div class="top3">
              <div class="two item">
                <section v-if="typeof this.userData[1] != 'undefined'">
                <div class="pos">
                  <!-- 2nd -->
                </div>
                <div class="pic" v-bind:style="{ backgroundImage: 'url(' + this.userData[1].avatarUrl + ')' }"></div>
                <div class="name">
                  {{ this.userData[1].userHash == userHash ? 'You' : this.userData[1].username }}
                </div>
                <div class="score">
                  {{ this.userData[1].score }}
                </div>
                </section>
              </div>
              <div class="one item">
                <section v-if="typeof this.userData[0] != 'undefined'">
                <div class="pos">
                  <!-- 1st -->
                </div>
                <div class="pic" v-bind:style="{ backgroundImage: 'url(' + this.userData[0].avatarUrl + ')' }"></div>
                <div class="name">
                  {{ this.userData[0].userHash == userHash ? 'You' : this.userData[0].username }}
                </div>
                <div class="score">
                  {{ this.userData[0].score }}
                </div>
                </section>
              </div>
              <div class="three item">
                <section v-if="typeof this.userData[2] != 'undefined'">
                <div class="pos">
                  <!-- 3rd -->
                </div>
                <div class="pic" v-bind:style="{ backgroundImage: 'url(' + this.userData[2].avatarUrl + ')' }"></div>
                <div class="name">
                  {{ this.userData[2].userHash == userHash ? 'You' : this.userData[2].username }}
                </div>
                <div class="score">
                  {{ this.userData[2].score }}
                </div>
                </section>
              </div>
            </div>
          </div>
        </q-card-section>
    </q-card>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  props: ['userData', 'colorData', 'userHash']
}
</script>

<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css?family=Red+Hat+Display:400,900&display=swap');
.center {
	position: inherit;
	margin-top: 10%;
	left: 50%;
	transform: translate(-50%, 0%);
	color: #333;
	z-index: 10;
	font-family: 'Red Hat Display', sans-serif;
}
.top3 {
	display: inline-flex;
	justify-content: center;
	align-items: flex-end;
	color: #4b4168;
}
.top3 .item {
	box-sizing: border-box;
	position: relative;
	background: white;
	width: 9rem;
	height: 10.5rem;
	text-align: center;
	padding: 2.8rem 0 0;
	margin: 1rem 1rem 2rem;
	border-radius: 0.5rem;
	transform-origin: bottom;
	cursor: pointer;
	transition: transform 200ms ease-in-out;
	box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1), 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.3);
}
.top3 .item .pic {
	position: absolute;
	top: -2rem;
	left: 2.5rem;
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
	margin-right: 1rem;
	box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2), 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.3);
}
.top3 .item .pos {
	font-size: 1.1rem;
	margin-bottom: 0.5rem;
}
.top3 .item .name {
	font-weight: 900;
	font-size: 1.5rem;
	margin-bottom: 0.5rem;
}
.top3 .item .score {
	opacity: 0.9;
	padding-bottom: 0.5rem;
}
.top3 .item .score:after {
	display: block;
	content: 'points';
	opacity: 0.75;
}
.top3 .item.one {
	width: 10rem;
	height: 11rem;
	padding-top: 3.5rem;
	background-color: rgb(241, 244, 58, 0.9)
}
.top3 .item.one .pic {
	width: 5rem;
	height: 5rem;
	left: 2.5rem;
}
.top3 .item:hover {
	transform: scale(1.05);
}

.top3 .item.two {
	background-color: rgb(196, 196, 196, 0.9)
}

.top3 .item.three {
	background-color: rgb(198, 170, 85, 0.9)
}


@media only screen and (min-width: 1875px) {
  .center {
	  left: calc(50% - (9rem + 2.8rem) * 1.5);
	  transform: translate(0%, 0%);
  }
}

@media only screen and (max-width: 600px) {
  .top3 .item {
    box-sizing: border-box;
    position: relative;
    background: white;
    width: 4.5rem;
    height: 6rem;
    text-align: center;
    padding: 1.4rem 0 0;
    margin: 0.5rem 0.5rem 1rem;
    border-radius: 0.25rem;
    transform-origin: bottom;
    cursor: pointer;
    transition: transform 200ms ease-in-out;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.1), 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.3);
  }
  .top3 .item .pic {
    position: absolute;
    top: -1rem;
    left: 1.25rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    margin-right: 0.5rem;
    box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2), 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.3);
  }
  .top3 .item .pos {
    font-size: 0.55rem;
    margin-bottom: 0.25rem;
  }
  .top3 .item .name {
    font-weight: 450;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
  }
  .top3 .item .score {
    opacity: 0.45;
    padding-bottom: 0.25rem;
  }
  .top3 .item .score:after {
    display: block;
    content: 'points';
    opacity: 0.75;
  }
  .top3 .item.one {
    width: 5rem;
    height: 6.5rem;
    padding-top: 1.75rem;
    background-color: rgb(241, 244, 58, 0.9)
  }
  .top3 .item.two {
    height: 6.25rem;
  }
  .top3 .item.one .pic {
    width: 2.5rem;
    height: 2.5rem;
    left: 1.25rem;
  }
}
</style>


