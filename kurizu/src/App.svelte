<script>
  import { Route } from "tinro";
  import { MetaTags } from "svelte-meta-tags";

  import Sidebar from "./components/sidebar/sidebar.svelte";

  import AllPro from "./components/content/projects/all-pro.svelte";
  import AllOth from "./components/content/other/all-oth.svelte";
  import AllBlogs from "./components/content/other/blogs/all-blogs.svelte";

  import AllChat from "./components/content/chat/chatRoute.svelte";

  import HomeCn from "./components/channels/home/home-cn.svelte";
  import AboutCn from "./components/channels/home/about-cn.svelte";

  import Home from "./components/content/home/home.svelte";
  import About from "./components/content/home/about.svelte";
</script>

<MetaTags
  title="Kurizu"
  titleTemplate=""
  description="Kurizu's website | Discord themed website"
  canonical="https://www.canonical.ie/"
  openGraph={{
    url: "https://kurizu.vercel.app/",
    title: "Kurizu",
    description: "Kurizu - Discord themed website",
    images: [
      {
        url: "https://cdn.discordapp.com/attachments/970974282681307187/977539362432643082/criz.jpg",
        width: 800,
        height: 600,
        alt: "Og Image Alt",
      },
      {
        url: "https://cdn.discordapp.com/avatars/784141856426033233/2b71440eb154c1c2897e956f1f0da7b7.webp",
        width: 900,
        height: 800,
        alt: "Og Image Alt Second",
      },
      {
        url: "https://cdn.discordapp.com/attachments/970974282681307187/978162022988525599/kurizu.jpg",
      },
    ],
    site_name: "kurizu.vercel.app",
  }}
/>

<main>
  <Sidebar />

  <!-- Home -->
  <Route path="/">
    <HomeCn />
    <Home />
  </Route>

  <Route path="/about">
    <AboutCn />
    <About />
  </Route>

  <!-- Projects -->
  <AllPro />

  <!-- Other -->
  <AllOth />

  <!-- Blogs -->
  <AllBlogs />

  <!-- Chat -->
  <AllChat />
</main>

<style>
  :root {
    background-color: #282a2e;
  }
</style>
