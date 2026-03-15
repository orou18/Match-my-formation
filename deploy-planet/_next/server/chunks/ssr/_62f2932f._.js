module.exports=[20450,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call NextAuthProvider() from the server but NextAuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/providers/NextAuthProvider.tsx <module evaluation>","NextAuthProvider");a.s(["NextAuthProvider",0,b])},59226,a=>{"use strict";let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call NextAuthProvider() from the server but NextAuthProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/providers/NextAuthProvider.tsx","NextAuthProvider");a.s(["NextAuthProvider",0,b])},74677,a=>{"use strict";a.i(20450);var b=a.i(59226);a.n(b)},33290,a=>{"use strict";var b=a.i(7997),c=a.i(74677);function d({children:a}){return(0,b.jsxs)("html",{children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),(0,b.jsx)("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),(0,b.jsx)("meta",{name:"theme-color",content:"#667eea"}),(0,b.jsx)("meta",{name:"msapplication-TileColor",content:"#667eea"}),(0,b.jsx)("link",{rel:"dns-prefetch",href:"//images.unsplash.com"}),(0,b.jsx)("link",{rel:"dns-prefetch",href:"//api.unsplash.com"})]}),(0,b.jsxs)("body",{className:"antialiased",children:[(0,b.jsx)(c.NextAuthProvider,{children:a}),(0,b.jsx)("script",{defer:!0,dangerouslySetInnerHTML:{__html:`
              // Lazy loading des images
              if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      imageObserver.unobserve(img);
                    }
                  });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                  imageObserver.observe(img);
                });
              }
            `}})]})]})}a.s(["default",()=>d,"metadata",0,{title:"Match My Formation - Plateforme E-Learning",description:"Trouvez votre formation en tourisme et hôtellerie",keywords:"formation, tourisme, hôtellerie, e-learning, cours professionnel",authors:[{name:"Match My Formation"}],openGraph:{title:"Match My Formation",description:"Plateforme E-Learning pour les formations en tourisme",type:"website",locale:"fr_FR"},twitter:{card:"summary_large_image",title:"Match My Formation",description:"Plateforme E-Learning pour les formations en tourisme"},robots:"index, follow",viewport:"width=device-width, initial-scale=1"}])}];

//# sourceMappingURL=_62f2932f._.js.map