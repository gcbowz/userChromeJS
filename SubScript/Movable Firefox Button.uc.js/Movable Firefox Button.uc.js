(function(css) {
  var appmenubutton = document.getElementById("appmenu-button");
  var navbar = document.getElementById("nav-bar");

  navbar.appendChild(appmenubutton);

  addStyle(css);

  function addStyle(css) {
    var pi = document.createProcessingInstruction(
      'xml-stylesheet',
      'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
    );
    return document.insertBefore(pi, document.documentElement);
  }

})('\
@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\
\
[type="appmenu-button"]{display:none !important;}\
#appmenu-button {-moz-box-ordinal-group: 0 !important;}\
\
#appmenu-button .button-text {\
display: none !important;\
}\
#appmenu-button dropmarker {\
display: none !important;\
}\
#appmenu-button {\
background:transparent !important; \list-style-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALoSURBVDhPdVRdSFRBFD5mkmVKivnzUJbYi1KR4EPQg2APgggR/YAvgi+R9GCW+LP+oJnbutuKuuUPSlEUbFmarWJZWBph/vQDElGI2YO+ZNSdmXv3unKnM7t7L3c3uzDM3DnnfOd8Z74Z4JxHQPATa32ILfN/YL0UjXP0pv7CQdN+bDcDmhy3mMHkeVca7csu8L4oO8W/DCeaAf1rdvtgE+2IdxmGhZ69rDunUZlxpuuV6TbSGVMklQKXKkFRBgty9X3/LPelPSV1wIkNnpFWGCE18JO5ku2bUeB8LkrxFOeTWtiQasAn38o8bYCx9sRxdhU4swcGvQJcuXv4jm/aWrD+puroPxRwQ31ZmkUaYF2qhXXtff9uUGed2VIVeJkTQa4HRxvONuB/zgGXe/eUh1dm0GyEKVIJ3DfvygelL93BrCaQIBi1IIg7v3iz0xN72udHqVI9rLBm4F53XgWwjphm5jABiXVb5G9qTxnSvo5u+6805np2YF/XArERHmCuBLu/NzqtVmy6PWok5DRMOtMrlPsPWEgz+EQcdcBjkDtjy6kdNAMIDaQFmPwg95LyoWufd6zkBOuI61eHi86awVlX0jeKtBgmZjeTWoC/a0iRLKCENBsbT/EUUQacXETN1MEG604r04G0oZJY5ti6IpiQKuDqlCUgAdaW8EkEGlUhb2qL3KDtcQPe5+dPmitRX1dkk3rwUBuyEEB1QPnS4K6AIN3Hymk9ApkkQK3oeCNxTBkvO66tfozRFp8kKwOFF2gj/PLTEVU3oN7u5TiNRHxhYqdUDd/9DnrTBSj+U1Q8ZleIFWR/MmEP2jBmlS974v1A+mVVJy8fIhbMhkIM6ZcIFAn0JAIEfbB/a+qryiMGhvnZUKdqsxBsRmSmTRhwzQSKohV7wob37K13sjrTLNaQN8fQiDuvWO7NGEVKy6QaJBxrqJVF1pNxX31YeGZTkYY/XuYT4ksT0cq0fb8260wNf6/C4/4Cy9GJxY8i1NYAAAAASUVORK5CYII="); \
min-width:30px !important;\
margin-top:1px !important; \
padding-left:0px !important; \
padding-right:0px !important; \
margin-right: 2px !important; \
box-shadow:none !important; \
border:none !important;\
'
);
