<template>
    <section>
        <h1 class="title"><span><img class="test" src="../home/assets/herbivore-large.svg"></span></h1>
        <div class="content">
                <h2 class="title">Questions about Herbivore</h2>
                <h3 >What is Herbivore?</h3>
                <p class="content-text is-medium">
                    Herbivore is a free, open source tool that shows users the data packets that travel
                    between their computers and the internet. By surfacing this information, we hope to demystify how the internet
                    works and make network literacy accessible to a much wider audience.
                </p>
                <h3 >What does it do?</h3>
                <p class="content-text is-medium">
                    Herbivore is a network analysis and packet inspection tool.
                    It allows a user to interrogate the network their device is currently connected to and monitor the traffic on it.
                    Tools that display data packets as described above are called “packet sniffers.”
                </p>
                <h3 >Why did me make it?</h3>
                <p class="content-text is-medium">
                    A handful of packet sniffing libraries
                    and desktop applications already exist for analyzing network packets, but they were designed for people who have
                    programming experience or a network engineering background; they were not designed as educational tools for
                    people without technical backgrounds. This makes it difficult for non-technical audiences—even journalists, activists,
                    and scholars whose work is about technology and who are familiar with networks in a conceptual way—to navigate
                    the existing packet analysis tools.
                </p>
                <h3 >Who made it?</h3>
                <p class="content-text is-medium">
                    Herbivore is made and maintained by Surya Mattu and Jen Kagan. Ingrid Burrington, Eve Weinber and Pedro Galvao Cesar De Oliveira have also contributed to the project.
                </p>
                <h2 class="title">More Technical Information</h2>

                <h3 >What is a packet sniffer?</h3>
                <p class="content-text is-medium">
                    A packet inspection tool is software running on a computer that allows you to look at all the network traffic that is being sent and received on the network you are currently connected to.
                    The range of activity this lets you monitor includes your browser traffic, your operating system sending bug reports, services like Dropbox and Spotify talking to their servers and content streaming
                    to devices such as Apple Tvs and Sonos speakers, and your internet of things devices talking on the internet.
                </p>
                <h3 >What does Herbivore listen for?</h3>
                <p class="content-text is-medium">
                    While Herbivore can technically listent to all of the information mentioned above, in this first version it is limited to picking up HTTP and HTTPS traffic.
                    This was done to prevent the activity you are seeing from feeling overwhelming.
                    Often a lot of the traffic on the network is not human readable (for example it is hard to tell that a packet is transmitting a small part of a song being streamed on your speakers by looking at it).
                    The nice thing about the HTTP protocol is that it lets us pay attention to the things our computer is requesting from the server rather than the content itself.
                    An example of this is when you go to a page with an image on it. The request for the image is typically made using an HTTP GET request, we are more interested in this request than the actual image itself.

                    For the more technical crowd all this means is that Herbivore is filtering for TCP packets on port 80 and 443.
                </p>

            <div @click="goHome" class='button'> Click here to go back </div>
        </div>
    </section>
</template>
<script type="text/javascript">
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: mapGetters({
    view: 'view'
  }),
  methods: {
    goHome: function () {
      this.$router.push({
        path: `/$home`
      })
    },
    ...mapActions([
      'incViewIndex',
      'newMessage',
      'newNotification'
    ])}
}

</script>
<style scoped>
.sub {
  margin: auto 0;
}
.hint {
    font-size: 1.1rem;
    font-weight: 100;
    line-height: 1.25;
    margin-top: 6em;
}
.highlight{
  color: #00d1b2;
}
  code {
    background-color: rgba(40, 56, 76, .5);
    border-radius: 3px;
    color: #fff;
    font-weight: bold;
    padding: 3px 6px;
    margin: 0 3px;
    vertical-align: bottom;
  }
  .content-text{
    width:740px;
    margin: auto;
  }
  .splash {
    padding-top: 10%;
  }
</style>
