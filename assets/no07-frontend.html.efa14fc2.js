import{_ as d,r,o as l,c,a as e,b as o,w as a,e as n,d as i}from"./app.00ec766f.js";const p={},h=e("h1",{id:"rport-frontend",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#rport-frontend","aria-hidden":"true"},"#"),n(" Rport Frontend")],-1),u=e("p",null,"Rport comes with a web-based graphical user interface (frontend) which is distributed as a separate bundle.",-1),_={class:"custom-container warning"},f=e("p",{class:"custom-container-title"},"WARNING",-1),m=e("p",null,[n("Only the rport command-line tools \u2013 rport server and rport client \u2013 are released under the open-source MIT license. The optional graphical user interface "),e("strong",null,"is NOT open-source"),n(", and free to use only under certain circumstances.")],-1),v=n("In short, the following is not covered by the "),b={href:"https://downloads.rport.io/frontend/license.html",target:"_blank",rel:"noopener noreferrer"},g=n("license"),w=n(" and requires acquiring a commercial license."),k=e("ul",null,[e("li",null,"Building a SaaS product or offering a hosted version of rport, either paid or free."),e("li",null,"Running rport and the UI and granting customers access to it, either paid or free.")],-1),y=n("Free usage in a company is allowed, as long as only employees of the company have access to rport. "),T={href:"https://downloads.rport.io/frontend/license.html",target:"_blank",rel:"noopener noreferrer"},x=n("Read the full license"),q=n(". The uncompressed source code is not published."),I=i(`<h2 id="installing-the-frontend" tabindex="-1"><a class="header-anchor" href="#installing-the-frontend" aria-hidden="true">#</a> Installing the frontend</h2><p>The frontend comes as a minified and compressed bundle of Javascript files and all needed assets. The frontend does not require any server-side scripting support. The rport server provides static file serving for that purpose.</p><p>By default, the built-in web server listens only on localhost. Serving a web frontend on localhost is not very useful. Change the listen address of the API to &quot;0.0.0.0:3000&quot; or any port you like.</p><p>Make sure you have the below options enabled in <code>[api]</code> section of the <code>rportd.conf</code>.</p><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>[api]
  address = &quot;0.0.0.0:3000&quot;  
  doc_root = &quot;/var/lib/rport/docroot&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),R={class:"custom-container danger"},N=e("p",{class:"custom-container-title"},"DANGER",-1),A=n("Usually you run rportd and the web frontend on a public server directly exposed to the internet. Running the API and serving the frontend on unencrypted HTTP is dangerous. Always use HTTPs. The built-in web server supports HTTPs. To quickly generate certificates, follow "),P=n("this guide"),L=n("."),B=e("li",null,[n("Create the doc root folder. Usualy "),e("code",null,"/var/lib/rport/docroot"),n(" is used.")],-1),U=n("Download the latest release of the frontend from "),z={href:"https://downloads.rport.io/frontend/stable/?sort=time&order=desc",target:"_blank",rel:"noopener noreferrer"},C=n("https://downloads.rport.io/frontend/stable"),E=n("."),S=e("li",null,"Unpack to the doc root folder.",-1),V=i(`<div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> /var/lib/rport/docroot
<span class="token builtin class-name">cd</span> /var/lib/rport/docroot
<span class="token function">wget</span> -q https://downloads.rport.io/frontend/stable/latest.php -O rport-frontend.zip
<span class="token function">unzip</span> -qq rport-frontend.zip <span class="token operator">&amp;&amp;</span> <span class="token function">rm</span> -f rport-frontend.zip
<span class="token builtin class-name">cd</span> ~
<span class="token function">chown</span> -R rport:rport /var/lib/rport/docroot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),F=n("Now open the API-URL in a browser. Log in with a username and password specified for the "),H=n("API authentication"),O=n("."),D=e("p",null,"You are done.",-1);function G(M,J){const t=r("ExternalLinkIcon"),s=r("RouterLink");return l(),c("div",null,[h,u,e("div",_,[f,m,e("p",null,[v,e("a",b,[g,o(t)]),w]),k,e("p",null,[y,e("a",T,[x,o(t)]),q])]),I,e("div",R,[N,e("p",null,[A,o(s,{to:"/docs/no08-https-howto.html"},{default:a(()=>[P]),_:1}),L])]),e("ul",null,[B,e("li",null,[U,e("a",z,[C,o(t)]),E]),S]),V,e("p",null,[F,o(s,{to:"/docs/no02-api-auth.html"},{default:a(()=>[H]),_:1}),O]),D])}var Y=d(p,[["render",G],["__file","no07-frontend.html.vue"]]);export{Y as default};
