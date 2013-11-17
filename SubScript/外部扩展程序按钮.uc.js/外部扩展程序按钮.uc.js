// ==UserScript==
// @name           externalAppButtonMEx.uc.js
// @namespace      ithinc#mozine.cn
// @description    ExternalAppButton外部扩展程序按钮（移动按钮版）
// @include        main
// @author         ithinc &  lastdream2013
// @charset        UTF-8
// @version        20130416.1.1.1 delay load exefile, may speedup firefox startup 
// @version        20130414.1.1.0 updated by  lastdream2013 : support submenu
// @version        20130402.1.0.1 modified by lastdream2013
// @version        20091216.1.0.0 Final release
// @version        20091215.0.0.2 Handle toolbar apps and menu apps separately
// @version        20091212.0.0.1 Initial release
// ==/UserScript==

var gExternalAppbuttonMEx = {
	autohideEmptySubDirs: true,  //自动隐藏没有一个子项目的子目录菜单
	moveSubDirstoBottom: false,  //把主菜单下的子目录移动到最下面
      subdirPopupHash: [],
      subdirMenuHash: [],
      toolbar: {
     //在这里定义好主菜单下子目录的名字,以及图标(可定义或留空,好图标不好找....)； 可在中间加{name: 'separator'}建立一个目录与目录之间的分隔线
        subdirs: [
            {name: '系统工具',  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADvUlEQVQ4jZXUX0wUBBzA8R+JY4czRxzcGWqZD5SgIgoJd0doSoaMKwSXYIqYhAP/gWPDdGlPbllYE9haohAC4/gXjoADNVI4FQyUvxegEHZ3HCogKYvavj2E3ms8fB9/n+338PuJiDh5RedGLNleYF0SW8is2l5g9YrOjRARJxER50XbLlhjztzlQLGVgyU2kossJBdZSCmxkmKwklJqJbVyhMNlNg6V2jhYYuNAsZWYM3dZtO2CVUScRURcvLaeI/L0ACvSe/BJ6yQ1b5CO358y9vQfuv94RnrRMKs+68HveC9+x8yszOhlRXoPkacH8Np6DhFxERFRLNRnE/6FGZ+DHXgnt9LSN4FtfBrL+DQjE9N8ZxwmLf8eG0528dahO7y5vx3flHbCjvewUJ+NiChERFzV4Zm8d6wD78Tb6FJbePBwmiH7XwyN/tfOL2/Rfu8JoxN/0/rbE0w9E1xpf8z6I7dRh2ciIq4iIq6em06xKb2NN+KukZbTyZ17k5i6H9M7/JS7g5NsTLtMn2UK84Nn9FumGLBO8fm5LkL2N+G56ZQDUoaeYP2BW7wec5WVH9fzmr6EZVHF+O0oZX/mTQ5900L7wKSj/knWJxnRJV1DGXrCAblpMwjdZ2JxRC25l+5jHppkaGSKmhtWQj6tQ3/kKlXXLdzoHqe5Y4yvL3bhtbmcd5KacNNmOKAFgYfR7LpK6J4GWrrG+aX9EY1tjzB1jrE5uYGjWW0s1xezPPIiyzbn4as38OrGSnQJjSwIPOyA5q/eR0BMDemnW6m/YX/Rjz9beD+pjtbuccxDf/Jr7xi9g5PszLiOKqSS4B1XmL96nwOa55tAwAdV5Ff0UVDVT0nNfYzNdk6evU3GVzcxmuwYm+3Um+zUNdnwDjOg0pQT/FE983wTHJDCO5Y1kRWoAr/HbVUWr/idJXS7gbBdlZTWDtLY8pDGFjuNt+zklppxX5OHR1AZ66JrUXjHOiCXpVEEfHgJ9zWFKAMK8QgsQrn2B9z9z5N49AoVxvuY2kYprDKj31uFu38+ygADgVHVuCyNckBzF0ewLroazyADKk0ZKl05al05Kp0Bj7fPo1ybjbv/t7j7Z6EMzEUVXIJnkIF10dXMXRzxAlLMUb874rMlB028Ec1uI9qEBrSfXEab2IB2bz2aPbUEJVQTHP8TmvhaNLvr0MQb8dmSwxz1BvvzE3ERN/84Jw+t/SWljtnk5KG1iZt/3POjdRaRl0VELSKLZpl6ZtZZZp6S84yqmNn3/6SYmXEWEad/AVgWg/PjJEAaAAAAAElFTkSuQmCC"},
            {name: '常用工具', image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADmklEQVQ4jZXUyU8TaBiA8ZeEhMBhjsZEQqCUsohhXwREoKVDpAlBR1oBkSWyVDA2CJQCLYRAo0ABURCQJSJrtYAKKmLgIi6cTQyiXnSYIRP/hWcO4MhlEj08t/f9Jd/h/URE3BQF9TplsW0noKSZX0lZbNtRFNTrRMRNRMRdWWTbKZhew/xyi/pXWzS+/oD1zTbNb7dp2fxEy+Ynmt9uY32zTePrD9S/2sL8couC6TWURbYdEXEXEfEIKLSiX9hEc/MZ2v4VMgZXOTX8gsyRNXSj6+hG18kcWePU8AsyBlfR9q+gufkM/cImAYVWRMRDRMRTeaGJrOkNUjuXUDuWSe99irZvhYxbz8no3+/Wc7R9K6T3PkXtWCa1c4ms6Q2UF5oQEU8RES9lfgOZY+skt7pIsS+Sdv0R6o7HaLqWSO9eJr17GU3XEuqOx6Rdf0SKfZHkVheZY+so8xsQES8RES//3Aa0faskWGZJst7nRIuL5NZ5TrYtkNK+SEr7IifbFkhunedEi4sk630SLLNo+1bxzz0AKQwWUu1PiDVNEF87RYJ5hkTLLImNcyQ1OUlqcpLYOEeiZZYE8wzxtVPEmiZItT9BYbAcgHLqSbI9JNI4QvTlcWJMd4mtniD26j3iaiaJq5kk9uo9YqsniDHdJfryOJHGEZJsD1Hk1P+A/M7WEV/nIqxkgIiyISIrRoi6NEpU5RjRVeNEV40TVTlG1KVRIitGiCgbIqxkgPg6F35n6w5AZ2qJMc0RqO8iOK+HkPM3CLs4RFjpMOFldwgvu0NY6TBhF4cIOX+D4LweAvVdxJjm8DtT+wPyza4hwjiDKrud7S//oNJ3EVo4QGjRbY4VD3KseJDQotuEFg6g0nftzWS3E2GcwTe75gCUVUN46RT+OhvvPu+iOm0nMMdBoKGboHO9BJ3rJdDQTWCOA9VpO+8+7+KvsxFeOoVv1gHIR1dNePkkCp2V5Y33fPz6jY9//k9fv7G88R6Fzkp4+SQ+uuoDUOYVjpudBBmuofqjmaAcG8GGVkJy2zia387R/HZCctsINrQSlGPbmzFc47jZiU/mlf8gT29t5d9x5lHSOhdRd7hI63CicTwgvceFtncebe886T0uNI4HpHU492Y6F4kzj+L9e9Xu9xPxOBSvzzuiMe56a4x4ayp+MiNH1OV/HYrX530/WncR+U1EDouI9y92eH/XXfY/Jfd91XP/vT+T5/6Ou4i4/QuMxVcZdYKnaAAAAABJRU5ErkJggg==" },
            {name: '网络工具',  image:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADsklEQVQ4jZXUS0wTBhjA8Y+ExMDBZCMqpS2FMh6lUmBTD0v0uMWMg8linMEHIYsHl7BEE2JQeT/EAWGkqQalSDoq70ehvNfW1gryfgghZTOByVqBhW0xGnf57zBcd5yH//H7Jd/h+0REQoyFyoy75Rp/fYWG9+luucZvLFRmiEiIiEioqTjaP+s8iX/1HP7V8wR8Fwn4sni5ls3Ln77+p7VsAr4sAr6L+FfP4189x6zzJKbiaL+IhIqI7DMVqXk+cZwFeyqLg2ksDX/Ms5FPWB49wvLoEZYG01kYSGPensriUDqLg2ks2FN5PnEcU5EaEdknIhJmzFfj8xxjtieFOZuBhf5UFuxpLA6mM9NrYHPFxF9vtnmxbGSqS8+czcBsTwo+zzGM+WpEJExEJLw2T8WK4yhT7XqmOw8z221grtfAnC2V8VY9b1/7efvaz5tXv+Bt1jHdeZipdj0rjqPU5qkQkXARkfDqXCVLI+mMW3U8bU1msl3PVMdhxlt0OJsSWXpcwh/b8yy6S3A0JvC0NZlxq46lkXSqc5VB6PaVKObtBjwPEvBaknjSnMS4VcejBzp+D0zyuCuT1pp4bMZ4frz3EV5LEp4HCczbDdy+EhWEKnIUzHTrcdXH4W6Ix9OYgLshHmfTp/y5vcirXR9b6y52A9OMmLS4G+Jx1ccx062nIkcRhEovK5jsSGTMGIvjjhZXfRxjplgmurLY3fSyNn2fCVsO7odfMlCrwXFHy5gxlsmOREov/wcqvhTJxMMEhms0jNbFMGaMpb9azeqTOnbWXfzqs9PxXQqdt9QMfR/DaF0MwzUaJh4mUHwpMggVZB/Ca4mjv1LNUHU0fbdUOO5/xs6GmwVHJZurPawvdWCr1DBQFc1QdTT9lWq8ljgKsg8FoRsXDuJp0tJXpqK3VInX+hW/vZjk5xkL5rwYeo2fs7PhZcVTja1cycBtNX1lKjxNWm5cOBiErp09gNscQ3exktbrCjae9bHsMdFcpKf5ZhRNeQo8bTlsLPfTlq/AVqaiu1iJ2xzDtbMHgtDV0xE4zVq6SpS03FRgzlVwL1eBtVBJb5WGzspoGq9HYb6moKUgip4yFV0lSpxmLVdPR/wLhX17KuJlW1Us7mYdrh+ScFiScFp0eFqSedKewuO2FFzWZJwWHY+sOtzWJNzNOtqqYsk5FbH17kT2nTmxP/ObLz7YupzxIe9Z4MyJ/ZnvjjZURPaLSKSIqN6zyL3ZUNl7SqF7atjevv+nsL2ZUBEJ+Rs6+oxWuBqWjQAAAABJRU5ErkJggg=="},
            {name: '编辑工具',  image:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADt0lEQVQ4jZXUT0wTBhTH8UdCQvCwxAtD4x8UCypVxIAoilhEMiOJBxKjAQIiBmVIGbbUxtqOyIrWIRTRWFAobeWfUiilojCULR4Gjj+ZqCAXQwygmBg1nr87gOtVD7/Te++TvMN7IiIBCrU+LVJjmovUlPF9Mc0p1Po0EQkQEQmMKDHNZXYPoBmdRDs2xbnxV+jHp9GOTlI6NkXp2BTa0Un049OcG3+FdmwKzegkmd0DRJSY5kQkUEQkSFFsJL1/CJWrl+TmB6S09qFy+Cj942/efPrCm09f0A0MoXL4SGntI7n5ASpXL+n9QyiKjYhIkIhI8IYzBg71PCHxtockuxeVw0divZuZj5853uLjeIuPmY+fSax3o3L4SLJ7Sbzt4VDPEzacMSAiwSIiy8IL9KR2PCLhxj322NzsvdXFTusdJubfk+P0kOP0MPH2PTutd9h7q4s9NjcJN+6R2vGI8AI9IrJMRGTZ+nwdyS19xF9tZpe1jYTau8RZGsl3eZle+MD0wgdOubzEWRpJqL3LLmsb8VebSW7pY32+zg+ty9OSZO8hpqyeHZcdxP/uIt7iYJuxlgrvIBXeQbYZa4m3LNZ2XHYQU1ZPkr2HdXlaPxSWe5Y4aysFDV62X7hJtNFGrLmRrYbrVHQ/pqL7MVsN14k1NxJttLH9wk0KGrzEWVsJyz3rh9ZmFxNjdvJydoGR17OkXmoi2mQjSlfDRfcAF90DROlqiDbZSL3UxMjrWV7OLhBjdrI2u9gPrcksQnm+DufgMO6hf9mstqDUXWNjSSWm9oeY2h+ysaQSpe4ayl+u0P3Pc5yDwyjP17Ems8gPrT5WyGZ9HWEZGn5rv091z19Eqq8QobZgbO3F2NpLhNpCpPoK1p4/KW+7T1iGhs36OlYfK/RDq44UoDQ2EZ5rZGOeAdfgUzqHJjha6aCio5+Kjn6OVjrwDD/HNfiUTScvEJ5rRGlsYtWRAj+0Mj2fLWUOFKfNhJ80oThhILfGiW/kBc9m5nk2M49v5AW5NU4UJwyLPafNbClzsDI93w+tOJxHXFUbUZpqokqrUWqr2FRkJrKwnMiff11MYTmbiswotVVElVYTpakmrqqNFYfz/oeCf0zLfhtrtrHP7kFl97C/yUOKvYuUxk4ONHRwoKGDlMZOUuxd7G9a7Nln9xBrthF6KOfd1xMJWr47LSPkp6x3IQezCDmY+Y3JIuRg5vzy3WkZX482UER+EJFQEVn1nQldmg2UpacUuKQGL+37LQlemgkUkYD/AEq2dU4D+CN7AAAAAElFTkSuQmCC"},
            {name: '图像影音',  image:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADm0lEQVQ4jZXU3U8TVhiA8ZekicGLJSaTcCFqzNA4EzXGkKhZGiLq6gcyFOlkWFtcaKmytVhXAlTLR1kjgwY/Kh91VRxi3Yg4Nxt1mMxNGStYKYNSKiJTUcRtZn/AswvqmixezItfck5yzpOci/eIiCRs3qPfmqktntyu+4Q3kaktnty8R79VRBJERBRbNMZJ9/ku/HeC+HuCXPvlHjd6B/ghEKI7MMiN3gH8PXe5ersf/527+HuC+O8EcZ/vYovGOCkiChGRWao8PZ7L3djc7dibO6hu9eE4/TWfe7/B4fHxxdlO+oai9A1FKT/Rhr25A5u7Hc/lblR5ekRklohI4kb1Php9V7G6zlB2rA3bya+wu89T1dRBWeMZBkfHefHyb+pOX6TU9SVlx9qwus7Q6LvKRvU+RCRRRGR2eraG2rZLmJxNWOpasdS1UnK0eWZ9tJlbgQGqj3vZX+nCVOvm4NEWTM4matsukZ6tQURmi4jMVmbuxt7iw2hvxFDRwBGXl5s9QX4KhKj3XOBIg4fvum8TGAjTcaUbQ3k9Rnsj9hYfyszd8dBa1U5KXefQHnRgdZ7i0dPnPHk2zeNn0zz/4y+m/3zJk6kXPHo6xeOpaWz1HnSWWkpd51ir2hkPpWVsx+zwoi4q58atXiJjvzNyf4LIgwkiDx7FTDByf4LW9kvkGsrQmKoxO7ykZWyPh1YpVRhsJ8nUmrk3NEpoOEooPPZalfUt7Nj3GblFFRhsJ1mlVMVDy9dloLM28P7u/fwcCNEXGqE/FKF/8D9CETq6rrFtr5kPCg6hszawfF1GPLQ0TUm+2cmGnELO+q7QGxwiMBB+rVD4Pk1tnWxSG8k3O1mapoyHUleuIfdADet3FGKwVNM/OMLd3yIx0ZiZff/gCBe/vU569sfkHqghdeWaeGjhstXkFNnZsEvPe9s0tHd+z3B0nOHoQ8Ixw9GHDEfHCYWj7CooIT27gJwiOwuXrY6HUpasQF1cxaYPjazPKUSVW8iV6z8yNDqG90IXDafOcvP2r4TCUcwVTpRZWjaqi1AXV5GyZMW/ocTkRe8+y9JZ0B8+gcF2Ap21jnxTFR+ZKtlrqUF7yEG+qZK8T4+wp8SBvuIY+sPHydJZSF60dOrViMyak7QgLykldWru/MXMTZnx9rzU15o7L3XmzPzFJM1/5+mcpAV5r4ZWISJviUiyiMx7Q8mxuwqJfUqKWDUx9t7/IzF2RyEiCf8AaBijWJqLC6wAAAAASUVORK5CYII="},
            {name: 'separator'},
            {name: '常用目录' , image:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADo0lEQVQ4jZXUX0hUaRjH8ScQSlHPsDrnvKfTTCNjiPlnxiCZdGwEExK7kC6iaPcm6KIwcKYk+iPU1lIUtGWbuo3aWlvTjmUUQdCahmFBejai0l2iXZssS5LdbVdiI/juRVN2WRe/q/f9fXjfi+cREZm1J8NacUBzTxx0uPmcHNDcE3syrBUiMktEJGW/5pq4uXIVYw0NPA6HSYTDJCIRnkQiPNmy5V0iERKRCIlwmMfhMGMNDdxcuYr9mmtCRFJERGbvc7i4V1fHkM/HsN+PvWgRt30+hvx+hktKGC4pYcjvZyh5Nuz3M+Tzca+ujn0OFyIyW0Qkda9jHnZtLYNFRQwWFnKjoIBfm5r49+FD3k5P83Z6mr/v3mV02zZuFBQwWFjIYFERdm0tex3zEJFUEZG03Q6LWzU1XF+4kJ/z8kjE47yZmmJ6bIzR1lZ+j8X47/lz3kxNkYjHub54Mf35+dyqqWG3w0JE0kRE0po0i4Hqaq7m5XEpN5fX4+P80dPD6eJiTnm9nPJ6+bG4mKe9vbweH2f08GEu5+YyUF1Nk/YRtF2bS29VFZe9XmIeD69GRoi63dyor+efR4/oyc/nTE4O55Yt49XICBMDA8Tnz6e3qort2twZaKtmcqWykvM5OXS5XEzZNj1VVdxsbOTPO3eIeTz85PHQv2EDU7bNb7EYP7hcXKmsZKtmzkCbNcXFUIiY203Ushg9cYLTpaVcq69ncnCQWzt3cnvXLv568ICnvb2cXb6cTsviYijEZk3NQA2aojsYpMuyOG6afGeatJgm1xsbedbXx0vb5qVtc6+jg2hpKc1K0WlZdAeDNHwMbdIMzpaV0a4UnaZJu1K0GQZ9jY2MX73KkQUL+Nbj4aDTSbOu064UUaU4W1bGJs2YgTZqOqeXLKFN14kaBp1eL780N5Po6+NZfz+HnE7alOK4YdChFFHDoE1/19mo6TPQes1JVyDAMV2nxTBotixe3r/PC9vm2o4dHDEM2pMvPa4UrYbBMV2nKxBgveacgdZlZnMyEKDFMGhVikNOJ99kZ/N1djYHdJ02pegwTaKmyfdK0aoULYbByUCAdZnZH6DUL9OzXhz1+YkHg3QHg8SDQc6UlxMrL6e7ooILoRAXli7lfEUF5yoqPtw56vPzVXrW5PsRmV0zJ3Pt6vSsyTUZWazO+OKTsiYji9XpWc9r5mSufT+0KSKSKSJKROZ9ZlSymyLJpZSSVFOT//2UpCY7KSIy638DQTApm60jPAAAAABJRU5ErkJggg=="},
            {name: '火狐目录',  image:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADqUlEQVQ4jZXUW0gbVhzH8SMIYgvzGijTLIu2Tjtb4yXqbC0olFKQUkr7UBTEzc3U2BgxiBSUgujEXrBzs1ovVbxk8RJvXe06ZlpNnErUxLsWLU7Ba72MPfTtu4fY6WP78INz+PH/wHn4HyGEcPJQPUiQ3C5bk2h+5pNyu2zNQ/UgQQjhJIQQzhL1o7UrXWPcsq2TbttAbd9AM7FB5uQm2ilHMic30Uw4unTbBrds61zpGkOifrQmhHAWQggXSXopl/qWiNJPoGyyoWyyEam3E9MyyYWOWS50zBJrnOFc+zQxrVNEGyaJ0k9wqW8JSXopQggXIYRwlageEtf7BmW9jfBqK/3Luwyt7hNZP8Z5wzTnDdOc+3WKGP0U3zRNEtUwgbLeRlzvGySqhwghXIUQ4ph36j1iu2YJe2IlpMzMy4VN+ha3CK0cJLrRTnSjnagGG5H1NpR140TUjBH2xEps1yzeqfcQQhxzQCnFxLROoygbJvj+K74u+o3g4ueE/DRA6OMRQh+PoCgfRvHLMCFlQ5wp/QtF2TAxrdN4pxQfgZILiWyyE3zfQtCPf7Ky/56V/fecLjk863qmmd38F/vaPyQ2jBJU9IrIJjveyYWHkFdSAWF145wu6icgrxfryh7WlX0C8rqxru5jXd3nxcw6LaN/M7a6x+8z6wTkvSSsbhyvpIIj0M27KCpG+SrfhL+um4HFHQYWd/DPNmBZ3MGyuENwjp4zOXoGDu7+2T0oKkbxunn3CHQjj+DSEU7m/oE8y4hpbgvTwhZybTOmhXeYFt7hl2VArjU4urktZBltBJeO4HUj7xDyvHaHoJIh/LJf8IW6FdPcNqb5bWTqJl7Pb/N6fht5Vgdfao2Obm4LaZqBoJIhPK/dOQJdzSWwcBB55nOkaS1Y3+5ifbuHVNWIdXkP6/IeMo0RWUabo1vaxfc7PYGFg3hezT2EPBJ0BBSYkal7kH5vwCe5Gt9va5GqmpGmPkWa+hRZhhFZehs+ydV8nlSFT0ozAQVmPBJ0h5D7ZS2Bhf3IM7rx03Tip2nHT2vEX9fNSV2nIznP8Nf14KdpR65uRa7uJLCwH/fL2v8hV7eL6o1T+S2cLTcTUmFGUWkhrMpCeM0gEbVDRNQOEV4zSFiVBUWlhZAKM2fLzZzKb8HtYsbmhxVxOa68nugWp9p0j1fhHpf2cYlX4Rb/w/px5fXED0vrLIT4TAhxQgjh+4k5cTDrLA4+JecD1fXgvR8T14MZZyGE03+JH4zfQFZkowAAAABJRU5ErkJggg==" },
            {name: '配置文件',  image:  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADn0lEQVQ4jZXUbUwUdBzA8R8bG4MXvfIFOZyC98CBQpjIJQjh2QHyMPEm4AGipGzHM+wETjh5GB2jxgiiENBpUHoQteWLIBjCbM2ZLh7UCoU0RCHIJCW0evHtBae39SpefF7+vttv+//+IiIuylRLnN/hyjm/I5WsyeHKOWWqJU5EXEREXP0yrHPpZ/ow949xfGCMssEJLEM3qLh0E+vIqopLN7EM3aBscILjA2OY+8dIP9OHX4Z1TkRcRUTcNOnlGM4NE1llJ7LKzq6KT4ioPE9kjR2d7TN0th50th5213YTWWMnsqabyCo7hnPDaNLLERE3ERF3X2MZcS39hFs6Cbd0stN8mj+f/03jl1ewfjpM18gE++t7WPnrHwZHpwkrPUu4pZO4ln58jWWIiLuIiIc6yUxU/UVCizsILe5gR04z84+X+f3pMx4vP+PR0xWerDxn/vEyFWf7eKOwldDiDqLqL6JOMiMiHiIiHipDEXuqe9HmtrDD1ER8WRszC0urFpeYWfzDYYnb9xcINjWizW1hT3UvKkORM6Tcl0dYaRfBxxp47dA72AevMTm7wOTsIpOzi9x2mJxd5M6D39iWWUfwsQYiys+j3JfnDCniswnJaSfQWE334Hf8NLPA+NQDxqceMj79H1MPmXv0hEBjNWHFH6OIz3aGfGKy2H60ma1JVpLNTahicvl86BpXb911+IVvx3/m6q27pJU1o02rYGuSFW12Gz4xWc6Qtz6ToIwG/BMt7Eo7yfc/3kOhN1H5YQ+XR+9weXSKb8amUETloIotRJNYgn+ihdffbsJbn+kMbdJlEJT+LpoEMwq9ifSSJqbvL3L9h3vUtX/BEUszI9cnUUUX4L//BP6JJ9AkmAk69B6bdBnO0MaIVAJSbKhiClFG5eGzOwvvN4/yQddXWN+/QJb1I7r7rpB1sh3fWDOahFJUMYUEpNjYGJHqDG0IS2bLgVoU+lwU+lxU+nw260wYsuuwtfbSeuFr2uwDpBQ1oo4uxjfWjEKfy5YDtWwIS3aGvLQGAox1qKLzUUXno95bhDquGGVUHpvfyn5JGVOAJr4E33gzquh8Aox1eGkNL0Pu64MTfg08WE2IqRVtzim0eW3szG8ntKCN0KL21RdfuEqb14425xQhplYCD1azfnv8wosTcVunDk/1DNq78Oq2WNbCMyh2fp06PPXF0bqKyCsi4ikiXmvk6Zh1Fcen5Oqoujv2/T/cHTOuIuLyL3Tiaqq+A005AAAAAElFTkSuQmCC" },
            {name: '常用功能',  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADq0lEQVQ4jZXUW0wTZhTA8UNCYuBhiQmZNUwiUfF+t1wLvUFbWwqFVi4tK0ipQItFXKGFQEEMZE6iomLIyB7MDNFJjGwMMYQsJpvZ1MzFyECzzG0uQZoo2abP/z2I6+t4+D98D+eXnIfziYjEpas0hTka3UKOVs+K0ugW0lWaQhGJExGJz1RrFk4MXODyzVtcGZ9idOI21yanGZua4cZyY1MzXJucZnTiNlfGp7h88xYnBi6QqdYsiEi8iMiqjFw1JwdHaAh24gtFCHT00tTeQ1O4m0BH79t3uJum9h4CHb34QhEagp2cHBwhI1eNiKwSEUlQZqsI95/FE2jF2xLG09zKwKVPefholqWlv3j5aokHPz2if3AIT3Mr3pYQnkAr4f6zKLNViEiCiEji/swsjkf6cDcGcHr9XL1xk79fv2H+6S+MjU8wNj7B7Nw8/7x+w/Xxr3B6/bgbAxyP9LE/MwsRSRQRSdyjzMAX6sLhrqPn1AAvXy3x+dXr2JzVlLoOU+o6jK2ymv6BcywuRjl9fgiH24Mv1MUeZUYM2rXvAJ5AEIujkjvffsfdH+5jcVRg/7CW0qpayqq9OD2NlLk9lLpqKHQ4KXHW4AkE2bXvQAzavnsvrvqj5FtLmJ2b59LIZxhLyiitOoy1vIrf/njO78//5PzwCHX+ZqrqGjDby3HVH2X77r0xaMuOnRyqrkNtNHPv/gMuDo9QUFiCtcyFocjO3e/v4azxojcXk2+x0fvxabQmK4eq69iyY2cMStu6DVulm2ydgdGrXzB5exqN0YKp5BDag1YCwTZyDSbURgttnREePX5Mjt6IrdJN2tZtMWhD2mYsjkqyNHpq6/3c//EhrR1dqI0WtAetVB9p4JMzg8x8c4e5J08ZGh4hI0+HxVHJhrTNMSh14yZMNgc5OgPKHDXdvX38/OQJp86co7i8AlW+kSxtARl5OpTZeW9TaTDZHKRu3BSD1q1PxWyvQJVvIkdvRJmrobbex5dfT/Lrs2csRqOxFqO8WIySnqfDbK9g3frUGJSckkJZjRdDUSnGYjumYgd6czFaUyFakxWtyYrGWEiewUxugYm8AhNqo5myGi/JKSn/QQmK5OTFonIXR1pCNATb8bV14QtF8IciNIW78YcjNLZ2cuSjdrzHQtQ1B/Eea6Oo3IUiOTn67kRWrU5Kcq1RKKJr1q5lJb2vULxYnZTkene08SLynogoROSDFaZYno2X5U8pfllNWN73/5SwPBMvInH/AlIIOOfCXNavAAAAAElFTkSuQmCC"},
            {name: 'about', image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADe0lEQVQ4jZXUb0gUZhzA8Z8giAYKvQiLRWh2eDPNhKvAU8/TS+/yTwqJVJL4h5XKUMQdp3TzTwQqipDhG9EIK2aOxpxjbKDeeaemnt5dFiuRrcI7PXVbo6L25rsXnrs3vZgvPvA8DzxfeF78HhGRoOOVAzknqu56E6uH2IsTVXe9xysHckQkSEQkOOHqoLdsyIlpwkPjpIfrFi9m6zottnVa7Ru02jdosa1jtq5z3eKlcdKDacJD2ZCThKuDXhEJFhEJia/op/jBKrp2J1mdLvTdbs71PCHn1jK5vU/J7X1Kzq1lzvU8Qd/tJqvTha7dSfGDVeIr+hGREBGR0LjSPgruPCejzYHu5iJZ7U6yO50YulwYut07ulxkdzrJaneiu7lIRpuDgjvPiSvtQ0RCRUTClBd7yOt9RlrjHFrzPJktDnRtDjJbF9A2z6NtnifdPIfm+mMymx1ozfOkNc6R1/sM5cUeRCRMRCRMcaEDfYcbdf00acZZUr6aQd0wTfbXs4w+9rL15iO/b7yj69sVkuttpBlnUddPo+9wo7jQEQjFnL9BZssSZ2qsqKrG+aJnkb7RVSyuDXx/fcSz/QHPHx/Y+vsfmvrdnKqe4EyNlcyWJWLO3wiEog1mNCYHqsoJTpX/zMuN97zefM9v6+9YWXvLytpbXvj9YH9NUulPqCon0JgcRBvMgdARnZHkujnii8eo6ZhhaeVPll74rbzZ4d/P/7pNWaud+OIxkuvmOKIzBkKH02o5fW0GZf4jZlyb2J2b2N1bnzTt2mLa5UOZ/4jT12Y4nFYbCB1KrkJVbkOhv8+o5SWTCz4mHTssfrv7yQUfY9ZXKPT3UZXbOJRcFQhFqipIKpki5uw9Cqu/40frK+aWtz/pl5k1ir78npiz90gqmSJSVREIHUgsIfGyBYXhIUczBonW9BGl6SU6/TbRWr/02ztnmj6OagdQGB6SeNnCgcSSQGh/XBEnr4yjzB0hNneE2LxhlPnDfF7wDXGFw8QV7qyV+cPE5g0TmzuCMneEk1fG2R9X9F8oNOJY/kZC8SDqWgvqOgspDVZSjVNoTDa0TXa0TXY0JhupxilSGqyo6yyoay0kFA8ScSzPtzsiIfsOpl4Kj9b7IqIM7EV4lGF938HUS7tDGywi4SISKSKf7VGk/26w+D+lYH811P/e/yPUfydYRIL+BSkIj6JbQMVJAAAAAElFTkSuQmCC" },
        ],
        	
        //1.在这里定义好想要出现在主菜单下,或在主菜单子目录下的程序(subdir没有定义, 或在上面子目录名列表中找不到名称相匹配的[比如写错了], 就会出现在主菜单下面)； 
        //2. 可在中间加{name: 'separator'},  分隔线如果定义了子目录名,就出现在子目录下面；没有定义就在主目录下面.
        //3. 这里定义的可以重复. 例如IE浏览器我想出现在windows工具下面, 又想出现在子菜单下面,   那么就定义二次:
        //    {name: 'IE浏览器', path: 'C:\\Program Files\\Internet Explorer\\IEXPLORE.EXE', args: ['%u'], subdir: '系统工具' },
        //	  {name: 'IE浏览器', path: 'C:\\Program Files\\Internet Explorer\\IEXPLORE.EXE', args: ['%u'] },
        //    就可以了, 建议先写完上面想要定义, 分类在子目录下的程序, 之后从中摘出你最常用的, 去掉后面的subdir定义, 放在最下面
        apps: [
            {name: 'IE浏览器', path: 'C:\\Program Files\\Internet Explorer\\IEXPLORE.EXE', args: ['%u'], subdir: '系统工具' },
            {name: '记事本', path: 'C:\\Windows\\notepad.exe', subdir: '系统工具'},
            {name: '计算器', path: 'C:\\Windows\\System32\\calc.exe', subdir: '系统工具'},
            {name: '命令行', path: 'C:\\WINDOWS\\system32\\cmd.exe',  subdir: '系统工具'},
			{name: '画图', path: 'C:\\WINDOWS\\system32\\mspaint.exe',  subdir: '系统工具'},
			
			
/*         
            {name: 'HyperSnap 7', path: 'E:\\software\\HyperSnap 7\\HprSnap7.exe',  subdir: '常用工具'},
            {name: 'Photoshop', path: 'E:\\software\\Photoshop7.0\\Photoshop.exe', subdir: '常用工具'},
            {name: 'separator', subdir: '常用工具'},
            {name: 'Total Commander', path: 'E:\\software\\Total Commander\\TOTALCMD.EXE', subdir: '常用工具' },
            {name: 'Everything', path: 'E:\\software\\Everything\\Everything.exe', subdir: '常用工具' },
            {name: 'HostsX', path: 'E:\\software\\HostsX\\HostsX.exe', subdir: '常用工具'},
            {name: 'Lingoes', path: 'E:\\software\\Lingoes\\Lingoes.exe', subdir: '常用工具'},
            {name: 'PDFXCview', path: 'E:\\software\\PDF Viewer\\PDFXCview.exe', subdir: '常用工具'},

            {name: 'Goagent', path: 'E:\\software\\ProxyTools\\goagent\\local\\goagent.exe', subdir: '网络工具'},
            {name: 'opera', path: 'E:\\software\\Opera\\opera.exe', args: ['%u'],  subdir: '网络工具'},
            {name: 'Becky!', path: 'E:\\software\\Becky!\\B2.exe', subdir: '网络工具'},
            {name: 'QQ', path: 'E:\\software\\QQ2013\\Bin\\QQ.exe', subdir: '网络工具'},
            {name: 'AliIM', path: 'E:\\software\\AliWangWang\\AliIM.exe', subdir: '网络工具'},
            {name: 'Fetion', path: 'E:\\software\\Fetion2012\\Fetion.exe', subdir: '网络工具'},
            {name: 'Thunder', path: 'E:\\software\\Thunder7.2.11.3788JayXon\\Program\\Thunder.exe', subdir: '网络工具'},

            {name: 'foobar2000', path: 'E:\\software\\Foobar2000\\foobar2000.exe', subdir:  '图像影音'},
            {name: 'PotPlayer', path: 'E:\\software\\PotPlayer\\PotPlayerMini.exe', subdir:  '图像影音'},
            {name: 'Imagine', path: 'E:\\software\\Imagine\\Imagine.exe', subdir:  '图像影音'},
            {name: 'i_view32', path: 'E:\\software\\IrfanView\\i_view32.exe', subdir:  '图像影音'},
            {name: 'Inpaint.exe', path: 'E:\\software\\Inpaint\\Inpaint.exe',  subdir: '图像影音'},
            {name: 'MangaMeeya', path: 'E:\\software\\MangaMeeya\\MangaMeeya.exe',  subdir: '图像影音'},
            {name: 'openCanvas', path: 'E:\\software\\openCanvas\\oC55.chs.exe',  subdir: '图像影音'},
            
            {name: 'EmEditor', path: 'E:\\software\\EmEditor\\EmEditor.exe', subdir: '编辑工具'},
            {name: 'SublimeText2', path: 'E:\\software\\SublimeText2\\SublimeText.exe',  subdir: '编辑工具'},
            {name: 'AkelPad', path: 'E:\\software\\AkelPad\\AkelPad.exe',  subdir: '编辑工具'},
            {name: 'SourceInsight', path: 'E:\\software\\SourceInsight\\Insight3.exe',  subdir: '编辑工具'},
            {name: 'WinHex', path: 'E:\\software\\WinHex\\WinHex.exe',  subdir: '编辑工具'}, 

            {name: 'Software', path: 'E:\\software', subdir:'常用目录'}, 
            {name: 'Downloads', path: 'I:\\Downloads', subdir:'常用目录'}, 
            {name: 'TDDownloads', path: 'I:\\TDDownload', subdir:'常用目录'}, 
*/
            //火狐目录
            {name: 'profile', path: '\\', subdir:'火狐目录'}, 
            {name: 'chrome', path: '\\chrome', subdir:'火狐目录'}, 
		    {name: 'CSS', path: '\\chrome\\CSS',  subdir:'火狐目录'}, 
            {name: 'SubScript', path: '\\chrome\\SubScript',  subdir:'火狐目录'}, 
            {name: 'UserScriptLoader', path: '\\chrome\\UserScriptLoader',  subdir:'火狐目录'}, 
			
            //配置文件
            {name: 'userChrome.css', path: '\\chrome\\userChrome.css',  subdir:'配置文件'},
            {name: 'userContent.css', path: '\\chrome\\userContent.css',  subdir:'配置文件'},
            {name: 'prefs.js', path: '\\prefs.js',  subdir:'配置文件'},
            {name: 'user.js', path: '\\user.js',  subdir:'配置文件'},
			
         
           // 建议把要放在子目录下的程序定义在上面, 下面的定义放在主菜单下的最常用的程序
/*            {name: 'separator'},
            {name: 'HyperSnap 7', path: 'E:\\software\\HyperSnap 7\\HprSnap7.exe'},
            {name: 'Photoshop', path: 'E:\\software\\Photoshop7.0\\Photoshop.exe'},
            {name: 'Everything', path: 'E:\\software\\Everything\\Everything.exe'},
            {name: 'HostsX', path: 'E:\\software\\HostsX\\HostsX.exe'},
            {name: 'separator'},
            {name: 'Goagent', path: 'E:\\software\\ProxyTools\\goagent\\local\\goagent.exe'},
            {name: 'Thunder', path: 'E:\\software\\Thunder7.2.11.3788JayXon\\Program\\Thunder.exe'},
            {name: 'EmEditor', path: 'E:\\software\\EmEditor\\EmEditor.exe'},
            {name: 'SourceInsight', path: 'E:\\software\\SourceInsight\\Insight3.exe'},
            {name: 'separator'},
            {name: 'Software', path: 'E:\\software'}, 
*/ 
        ],
        //   在这里定义firefox的功能按钮, command就是一小段程序, 可以从firefox api, 小书签或鼠标手势中摘取;可选自定义图标;
        //    同样, 建议先写完上面想要定义, 分类在子目录下的程序,  之后从中摘出你最常用的, 去掉后面的subdir定义, 放在最下面
        configs: [
		//常用功能 
            {name: '开始页面', command: "getBrowser().selectedTab = getBrowser().addTab ('about:home')", image :"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABt0lEQVR4XrWRTUsbQRzG/7Oza3ZdXQgimBRsYoJFtKviwfZgSlRaagiimEAoei5ID3ooCB5ySrQln6LFgwEvQkQEX25evBQCNg1akG7swTaaN3fzss4GgmYlKxb6wDAM8zy/eWYG/qNU9HQitGj1BpuBqNMTNtfGXRfVKO70fo6YGDrCU/yuBqFU+GPCWNLmBwEOz6cPZjP//uP8FAyJjoFmij/AmILlBR+r99L6sM27MsmxzOrcjJu7yJVgzNVvAkDPD4+OQZMhwDYRGmYoam3O7+byJQS/L6/hb1YhEJG0R7qo7gqON2EnTePtwLSLY1gWztMFUFUV5GIZkqkMvHrZV11r6vUFm+oaPJkKtUEZ7792D7a0Cq0oKV2C5q1JVgDiZ0V4ZhWgp7uzkDiRtgjkbTwaVGiNJit0TOztau+yWfD3X2moVGrpekiC7I2OiFzuWn4hpWCTZL3I7gl/Jc3eaa88Gxgnda/ASE6LAF/WdqBcPQRtoNsHDKt+nxtOz40B9g4B1qN78DO2hO79QjavkKolQwDxNP7GXEEmgKIhgHgaAzJ5Q0DNYwxgMPp3wI9vCXisbgAVzaN7FRuQEQAAAABJRU5ErkJggg==", subdir: '常用功能' },
		    {name: '新标签页', command: "getBrowser().selectedTab = getBrowser().addTab ('about:newtab')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlklEQVQ4jZWSv2tUQRzEPzPfvRfPRkMK/wSrVKKd8NTKTkvBwpBC/yBrIyKo+Sd8EMTyohY2FrYi8czlx6l399ZiLxeM70AXloX9zs4OMyM61uW7268l10ggoXI2H7fv3DiLTV0EUtSbj279cbf1ZKfuwnYSYAOw+37IaNxSrfaRoxParcAGxPeDKcPDGeeqCpYQeCmBwBYKg71cQTEs6gIqGwcIFMYJHEI26xtNlqAMAfQiSa43H94ERJaQyhwJzwnWLvS4/eAaZXi6nj0f3EsnLwYfhuyPJuXXMApzcDxDEntfxrw9nJRILZSM+j3kICGRgdG45dtRiwJwZppbZrOMU5BC/DzKRAgFKCC3GSJImstaudhnJVUcT2AKXFqt2P86JkdQrZ0n9UyEi7FAm/NCQfN0a6eWAxzIgWyu37/Kmx8TRhORktl792mezryZCDk+p656rm80GeYmtiJSSWfw+IrOYrt7oNNtC1t/JbDoQedtCRml0siS6v8QCDJAv4Jf0LZ5QfqvCppXL3eLsXFibDRdyN9K42ghbvPjbAAAAABJRU5ErkJggg==", subdir: '常用功能' },
		   	{name: '打开文件', command: "BrowserOpenFileWindow();",	image: "data:image/png;base64,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", subdir: '常用功能' },
            {name: '隐私浏览', command: "OpenBrowserWindow({private: true});", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC50lEQVQ4jaWTy2sTYRTFzzczmUxM05SkaUyTpjVV0bYWn0VFQV0oCIqguBB0oXt3IrjQjbjRv0EQXIi6E3ShIr6qjaK2tZqqNX2kkzYTkybzzsx8nwuNiuDKs7r3XDiLy/kRxhj+R8KnByfZ4nQW9wtXSNOc+qL4WlsDYqyjRQeAUslYpmuGsyLT7vwdwF272z3VXMbG5JZqpXJ+sD+cW7lCmuaZ9YCjxv1MF2bW9Ponq+XyhQ8TcggAch+L5POn4lFy7uzVejLuV+YW/ZORNn5g1epIV7q7A8GgH7WaDtO0wRigqiaqpW+YK2gFVaUTwQBJqKabEgJ0fK67XepL9R7K+EQGTeMxX2QItwGdieWoqxY+5BahKB7choBkui0lEC8VChKMjla/CBodWODDPX2v3hVMRankHXtpDETc2dOzMrlr11pouo2RlznIha+zhDSGBSG0IZFMpHcPxQKGSWWhpmLSR+ie+lL5djSaPgGkMJt/yM0XvKwsd26yrAb0evF5/8CWHc1flUvvb3kmd6Smei+ERDBrK0oLupIdhzWjEnAc8V0ytV51nHrNMi1Q5iIWa1ctQzlNCAkJvsZQJp3aN13QaLFk3CQjN/ayR6ODWLP+IKYXLHiuC4Hn4FGCTCYGAJidLcNxXLiuB59PRHfMxJPnhXut8d79Qmd8Gcql/J3hl/noxsHwdqk1AgYRRVlBSHLAKEWLRBFJRcFcA8bSArKvS7nJfOPUljggAEDf8mcHbmX7xaVa56WuhHI80ubr0FTVezxfnAJlCEp2r1EJ8OWKpcgKuz4j2xeHtq6rAj8DAGDz9m0OgDMvsuOXfTzZRBmrW7Y+AgCSnwzxnB3WDefN1h0bFuPpP6rcHKLVY3hbPAHKMiXdUO+BAAHJDwAwLXuY4EfTx95MwHU9UEpACAHXDCBUR0/4IUTBAuF4cOQXGuAIAccR/GH9vo2//wwAsF0R0cAEksGn8Kj0b/z+EvlfnL8Dt1NfXJ/gKfUAAAAASUVORK5CYII=", subdir: '常用功能' },
		    {name: 'separator', subdir: '常用功能' },
			{name: '高亮查找', command: "gFindBar.onFindCommand();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAALxSURBVDhPfZNrSFNRHMA1ijSyLP3YhwK/ZJQgSH0NYUGJqYE9QXLFclizfECYoLEWQ1EUS6ezqVljE+baw3l1072cd2tzu3u4uYebzm1m03LOtLJOZ3pBpegHvy/n/H+He7j3xu0mLzs7xahV1H1ElU6dRhUclw91Pi1/mI5v/x/5yCB5yu5Y/KCwgi6RcbVDNBkRKKy/3e6ZDeUo0gRHErYn/8EoIiK6vPOgnq2PMBGHW2n55EUmQ/bn742Gmp6JUGDxK5AOSxhwNH672EVxbm6SGcMWG7n6iFDnt61/31wOr26EZxejc66FNUcdx4rUsDT+2dlZwGS2Z+PZDnxON0WGToHaPoNlLrzmmfsc9foWotOu4IrJPLOkbxG5+gpeyAZRqx+Mj0m78WwHCZ8z+HZQv/mSi+nswYjRPh9BXaGowhlYkUn0QSaFZay9Va/u4UrNAFWNaWGy9xqiAQ5bpLQCSodOqnGEhQbPEs/kXWYMm4Llj7oMd550Y5TrdEWHeNwBVGMjMjzbof1VI8Hh8oKyNjVGYWG19QLH42fvzHlFzeiFsjfY1QedlnukJtmIc2Ye9HP6KvBsL9oJlRrzhMENqkyYQ1OS77bp8+8zjVfy6erbBbVIjxLz/5gYV65lZWWdwZO9VFVVnbVaTF6n/wto7jfMVTLUkgqGWtDYr5+edIbA2uoK4PMHflVXV+sIBEIGnu2FTCanaTWKXpvN+s0Nvwm3LwBsNttP2bCY19ra6hAIBIDNZgMqlRoqLCy8jGd/U1paeqrjddOl5kYa4XxGxsnYWnp6ehqdTp8Ui8WAy+WChoaGdXgIeSuAxF7LfuhBaEJRUVEyhmGZwWDwWiAQuCmXyy/G1hITE0/AKwzxeDwQUygUAhqNtnXIAeghaDL0OJFIPI2iKNHn87V7PB4GgiCknJycTLh3DJpKIpEYEokExGCxWP1wLW4fNPYEsZ/lMDQJ9wj0KDQWpkBToYnQ+MrKyuLe3t6WkpKSc38AHoOhsg8ORu8AAAAASUVORK5CYII=", subdir: '常用功能' },
            {name: '代码速记', command: "Scratchpad.openScratchpad();",  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACaElEQVR4XpVTTUhUURT+7n3vzYzjaBIqtTHIWgRFQhbZP22mVi3GhSXuwo0QISWSg/1Bs5xFVIsWQbMYCCR/RrMmy0IYiqRFENjYJnTUzIJSnMmZdzr3vpl0LIK+y/cu9xzud893z31iV+jxt+WfuYoVm0BEWAshAIM/liHn3aasNqVUsSKIbVeHKNl9Ev/C2McvaIm8jpZ5zDPWOhGpTlbon5jFADP2wZn7mAqe9h4cqq3Evea9p3+ks9GsbYOwCrNQtsc0YAhA8CAeOR13LCznbBzbXoVIy76ms9E37Eg0irwXk5kXkJAcVGFi2vnKWg9sRWVHL7K8zoQDWMnZASIDECgWcBsSQgs4sCUw9T2NcKBOswCtq7FOwGUYENoC9KxuPJ3NIbmwhAxbUNhZXcZxQELzTwtCJYQSk/C5TVR1D2k/qStOl0RHPzZ4LSxmiYUEhCiyIH5vLuPN5V2DGDvnx+Fbcfhc0hHg6WnrcfjvPiNpQpiGXBUo5U0Wi5S7DVgXB3C/5QguP5/SHXFbEkQAsZXO+CfcaWxAW0+CVBGo6Y6RwsP3KXoy+ZlwoZduvJilU9FJKrnUT6+mFmg4OUeDE7OkYHX26Vw4MU+brw8rEQ3dQkMtmNNLGXhdha7oHHP1eZdybnoxAwidczI2Ed+6jZdtB3F79C2XbaBp/2403BzT1lzqkjv60NxQB5/HQiTxDjPBE/VQ/8LfUBqM0fmRFHl5LsDbFaP2kRnadO0RAdhTE4pD7Ag+GF2xfEfVS1ND8HCxlxJTYs4W+kVuhA2Fr5C6famgv35LKD4OxzFqmRX4P4wjj18DkA9ZedxQgQAAAABJRU5ErkJggg==", subdir: '常用功能' },
            {name: '页面源码', command: "BrowserViewSourceOfDocument(content.document);", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVtJREFUeNqkk7FOwzAQhs+pCUMXiiJASEiAGALdWJkBifcAKiRehJ0BMfMGwM7AjNSBgY1KbKgtAxVtfHf47DhJEUMhlpw7O3ff/WfLipmhzlDrx72TqDG6iqLJzEkmWwA9NxR7qrbOuqxjhNVdgn5v7U/Vh69foFr799xMFn8NSNqb0N7Q8HD7MuV3GhdwOHmCg8GlB4zfn//V/3yyAzoevcHjzRF0++OZEz/0CizFDJ3zO9CykabbkForN4IEgPZixBIxGFmjt8auEcH5mQTYoQNVbhNZgY2xiQRMJYS4hJpQxM6mGXiAT5JN9oHoEwz6YKksvkEFWYiz60/d8gCR7iBcgVBlLUBSzneF8jaKFsj+FNmYQxww9OzOJMguLeWASD5YUUB5f0W16vyhrAAUgVipzGoqmZwqdjZASgBwLl95NQHGQUk4TFW2lAPU8t51reeo6j7nbwEGADr8N/Rn7FC4AAAAAElFTkSuQmCC", subdir: '常用功能' },
            {name: '页面信息', command: "BrowserPageInfo();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqNJREFUeNp8k09IFFEcx3/vzZudUVd3VsVsNUEhBOmUbBSh/blo1CEirGjzZh2kDaluHYSEbpFIghR18FBCHqJDFERIddMiqKBDkImr667urKszzsx7b3pv0TFraeDH+/f7fd73N7/fQ77vQ6lPC9fuChn1uwEh5JqLaaeQSZXyQ38DatqOnWw60T+gN8fjVDWquI8AOebaxuynz6nXoyMrX15NlAQgHNJaewZH6ruTfVlLB75eAAzbcE+rhCqNQvbt6MSvyVtXmGfn5T7Zcmg9P/SwrvtGIr1gAmY2ILH3IFFdPOubyANZy0HBJhA9OnDOR7ohMjslLqdYOhjN8eN1Ry4nMnPLgFwXfMaKFi3DReMbTnGNXQdscwUi8d6uipaOnkBBrKP3qmWJKbUD0cjncOZ+CqjYIGg7Z8o9CKk6RPZf6hcqnmJF1SsrGuOHvXULVGCgIQblCofEwUp4kYzBy2sxoC4LAKoAg2NBuKm9HYXCezApM+qARAzwXEBSOuXgOhTG35k7qiMh0lTggCgFNRTWFC3SQEAQmesBIoIs6UKuIgJcj/9T8zIsgqUYmScrTnzsWbm0Zy4sy78pFWypiGrbJdRF3tIwF1DGxSgUrWZsZuVSmDNvzfw+NaUgUgyWDnJkfyjwKQNFqtu8AAvf1R/vp31mzxXLmJ4Zv7uRnedYtM6WisELDQEg0Sn6gW4Gixy9fBaWZx7fE33Ag06s3ndxuKXrdlIcg+N4oGhkR/5SBVFVAKzB7Js7k9mPYz07AKKmJLL39FBTx/WbuhHD3PfEpTQAhNRycApLMPdh+FHu65MBEbda8jGp4YbO2razyarGA4coidZgQcYsbxbmp2ey356Nufmfz//7GoMDhGoQqagXU+zT9YzwWyzl91uAAQDUCFTmpTZ8qAAAAABJRU5ErkJggg==", subdir: '常用功能' },
            {name: 'separator', subdir: '常用功能' },
		    {name: '内存占用', command: "getBrowser().selectedTab = getBrowser().addTab ('about:memory')", image :"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdBJREFUeNqcUz1LA0EQfXsXDz8jKAERsQiYQuwEsbfwq7AWe/0FamVl6S84W7GxESvTi/4EGzVW2ojxI8ll9y6368yuCSYRURdmd9/uzJs3e3PCGIP9/TODf4y9vTWRaYL19dlvnYxxEycyENB8oIGjk5K9twT1dNiC09PLX2VeXJxr7VsK0lTjxctCrCwj1w+MsPUB2QAYIIsS4E0BV+E5YpV2E8SJtqsmhSmr1EwK8HGNghPaUw6UKYmMG90ESazt5QA5KrqvkwUUyE+Q8YGGdipsMpkiqnQQKGK9zUygQE41CujxPp2J0PdcdiZlH6ne2hUwm5KurmpMh5/BLD8iMs9zpTVLl7JBKjoUSOXqqiiHWTJzBkwgHEH8haBdQdUdrs4MkWeZtMLZN2OCfOT9A32JTgVEMBbdwVAqbbStmfcOwzZQEyvCnv+FIFYCxfPoj40s3GyM+w3C8MJmqrwHmwyvr2Wb+/R0Ly9bQlQPSSB2dhc6GomeuC77bHA+H8D3a04+dYKhx8vnsyiV4tCYQSTJ62FXI0n3xOHS0rjF8/OTGB3tt/vn5wjlcoRCASgWH8OkYVoErRJ4bG8fm6enmx8rz+WmcHCwIZr4Q4ABAI8O/FsARX5sAAAAAElFTkSuQmCC", subdir: '常用功能' },
            {name: '插件信息', command: "getBrowser().selectedTab = getBrowser().addTab ('about:plugins')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB50lEQVQ4jaWTwUobcRDGf7O73diktStGMVBdJIdYhL5GKZTWQ5/BoxfvHjz14qHHPkdfom9QPfQQVGrQgtomwd2Z//SQ3WAM0kMH/vDN8J9vvvlgxN35n0geFo6Ofn4eDv19qyVf9/c7e4/V6pBaweHhYMdMP11envZarSbD4YhXvZcAfD85o66trKwXcRzvHRysfZlR0GikOyGE3ubmBkUhtNuB8V0MQJ6voxqxuuqoSirSeAs8JGh0z8+v6Pd/kGXPub39Q7u9BsDV1QWLi8+4vv5NnnfJ8+VO3RfVYGHhaTfLMsyEfn/AeGxk2RJZtsR4bPT7A8yELMtoNtPunIlRJJ08XyHP38w5vbW1MZOPRizPERwff0MkwixgFlANqBqqVuVGUShFUVKWyu7ux1mCJEkBcA+4B6JIEQEIhABmEAK4CyDMKTAz3KWaaJSlUZZKWSqqdV5O8YyJndcftqNooZJvqIaq4T7W6UrwhKXeu+2pgtGv06Y7qOq0sSzLGVxPNlNEEu5uzppTArUonnwMlWy79/SemRNDRQxI4ilBMJKJ1PLRnc0Us0AIAQgQJr2VibG4p7g3gAR3xV2BCHcDDEgQMUQCUdTEPRaojilOX6yli72eu8XAv+5bRGIrbk9OrLi5+AvbLV+clWSB1wAAAABJRU5ErkJggg==", subdir: '常用功能' },
            {name: '缓存信息', command: "getBrowser().selectedTab = getBrowser().addTab ('about:cache')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArlJREFUeNqMU09IFFEY/83M252dndk/bu5qtGsrBop/8GCRIrRFtZVYGJWBFmSBStihQ0Z1yaLCm0TRnjY8dOkY5KlTUF46BoERmbrquLuhrrszO7s705sRtiyFfvC9N2++f7/ve99jDMPAdmidJIa24oCuEEtMfH2SYv62I9gBusbixOlo+fwm9mFbOyvA8PDw3camtke64QTLsvBXusoGc/JM+Xvi6SujWCxCya0isfBlLBaL3bcCBKr2HurpOYPvcywEQUBbq4TH8X+zRY6cx+LiInK5NShK5jBNzLB0Eaqrg/UuSUKk04+B9wE0jbtRymytTluQ0H2vGYPPo2AYAq+3qo7+drJ0Cfr9gd0c4VEoADePjSEQ8iLadbLsnKGUa/pk2AN59HVdo2VyEF2+AFWFzTQNHk8FXywR/FgA+upuoagaePnuGWpad1nOWWUVS299ONc+iEioF9lsFg5etFPfJpNBo8vtorQAjoab+abheOUouquv49NketN5yofegyM4Gr4MTdOoLQObXTDJ7SOSy9eg5J2YTxQRqCTgKuzIKcDZ5lFsrBt4PfUCFw6M4FTjFaiqullSJgPeboMo+ZqJx+tvsdkcyOfzMIzNxgkOoFRicTVyh96zAxfbb1h684rN7DzP03MWklTRQhgQnyyvwO0uIJVKWUZ/SrT+EtLpNA1YgjkDBbPTFKqapyXzEimVdEMQnIjH4zSIG+FwGLW1tdYeCnrw4OHEluvs7+9HMplEIpEw2eisAUMkHEcHQ7EUZn0mXV3XwdEWE0K2SHCPH6FQCNMfp6meE4maW1tOpZaqOjs7IMsydTRHdYMGWoOcFCCKQjm7KIqYm1/C7Ows2jv242fy8zIzNDQ0wDu8t4lNdJsDQmkZZqNMsUBfq07F+C2MqStomfW8ujrO7PSc/xe/BBgA9VMOEZUFd1sAAAAASUVORK5CYII=",subdir: '常用功能' },
		    {name: '遥测数据', command: "getBrowser().selectedTab = getBrowser().addTab ('about:telemetry')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACh0lEQVQ4y2P4//8/AzIGAhUgbmRgYN/GwCV0F4xBbLAYgwqGejTNGay8ojfEFTRvq+ia3TCwcbsEwiA2SAwkB1KDYQAQsAHxMlE5tTuKWobXJBRUm2RUNC2MrJ1PgTCIDRIDyYHUgNSC9CAb0CylontbWcvoqIiUgjbMdBVto71KWgY7YHxhSXltJU3DoyC1QD0NUL0MmqKyarc1DS2vCUnIaSI7T1hSbrGwhNwCZDFBcVlNdUPzq8JSKiBD1EAuadI0trolrajRjB5AnPyiwhx8ogLo4lIK6s1q+hY3GRhYGhhEpJT2mdq5XReWUjRDV4gLC4jJmhlZOV/nl5DbzaCiY3LD1T/yqo6Z/Q1eEZmdDAysKxkYGBWxRK8i0MZlXEKSOzSNrK/aewZfVtDQv8CgbWx90z8yGSgQeEvT0Hy7sLT8SkZOAUwDOHgV+cVkl6rrmGy3dva54REcfVlNx/QKg4aB+QHPwOhb2saWxsR6QUPX1NjJO+SGsrbhbgZpRfVWR6+ge3Jq2i2YtgrIMLDzi6OLSytpNtu4eN8Rl1VuYhCUkNe0dvG+Z2rnfp+FT1gLWSG/hPxyXjHZ2aiG8msZWjnfNbNzu8MnLKUJFlTTNmxzC4h8qGNhf56FVxRuiKm91zFDW9cDcM2cfFrqRtbnHLxC7iuq6zTDU6KYnDKboaXdMs/AmCeWrn5PgOm+XVHL2Do8reBWSGLuTRlVPQthGaU2EzuPR06+oY90jC2XAVMlG0Zm0jW1zHT1j7jvHZHwPCQp73l+Xffj3NrOx4HxmU/dgmKeOngH39U0NMvEmRtBWMvIQsXYyrHZMyRqb0RS9rPwpKxn7gERewzN7ZvUDUwwsjMAg6nS6ZcXp8QAAAAASUVORK5CYII=", subdir: '常用功能' },  
		    {name: 'separator', subdir: '常用功能' },
		    {name: '权限管理', command: "getBrowser().selectedTab = getBrowser().addTab ('about:permissions')", image :"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAUpQTFRFAAAA////f39/mJiYmZmZmpqam5uakpKSlZWUh4eGh4eHioqKi4uLgYGBgoGBg4KChISEhYSEhYWFhoaGh4eGd3d3eHh3eHh4fX19fn59cXFxcnJyc3NzdHR0dnZ1dnZ2eHd3eHh3eHh4eXh4iIeHiYmJjIuLjo6OkZGQnJycnZ2dnp6en5+eo6OipKOipKSkqaiotbSztrW0ubi4ubm4urq6u7m5u7q6u7u6u7u7vLy8vb27v7+/wMC+wcDAwsHAw8LCw8PDx8fGyMfGyMfHycjHycnJysnHysrIysrJy8vKzc3Mzc3Nzs3Nz87N0M/O09LR19fV2djW2tnX2tnZ29ra29va3NvZ3dza3dzc3t3c3t7d39/e4N/d4uLf4+Lf4+Lh5OPh5eXl6Ofm6uno7Ozr7Ozs7u3t7u7t7u7u8O/v8vHx8/Py8/PzVLDF9gAAABp0Uk5TAAACeXl5eaCgx8fHx9fX19fX19fX8fHx8fE925PMAAAAuElEQVQYV2NggAAmVm5JSR42JgYYn13HKzPTW48DJsKslRkT7pySq8sGFeByCfU3EbJO8eaBCoinOVgIMAo5ZUpCBUQzLd2NBIyDMyUgfF7TdF9DVzO/aE9uMJ/PKk0/0sfcPiRdmwXE57fJUDGwS0pNc9JkB1kr4JCl6ugSZSoqxskM4gs5Zau5hUlL8ULNF/bIUbcNkGGAA8VYjcCgBFmEgFJcRLK8nCBCQDkxXoEBGSgrK4sg8wHETR3KBnkdcgAAAABJRU5ErkJggg==", subdir: '常用功能' },
		    {name: '故障排除', command: "getBrowser().selectedTab = getBrowser().addTab ('about:support')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnRJREFUeNpsU01ME0EUfjuzu2BKlraGGEqlNW2MqMSiXtBEuZjQgxdIBBNJTAwXuUgiXjxojEcT40E9qAe9SC+CXDh6QAN6IWKKyo9iSISmP2CBtLsz3fXN0i4b2pdMduZ973vz3vdmJcuyYL/dlmWvn5AunyzHQJIgw9jUmmnOPuM8tz9WcicYQeJxTXt8NBC4ftjvB0WWARBnuFZzOVjIZp9+SqXuveQ8W5XgrqLEzrW0jLW3toZZOg16NgsmYyCVA6mqAvV6YcE0k69WVi69Y2zNSTCMN19obp7tCAbD/5aWbKJzg7tcsSiFeVVNvk+nu95yniECiHo8t06GQuHs8jI09PRAx+YmeLq7gSMmUol9DH1aXx8YpRIcKRZPtNXV3XEqmIhENkKK4t1eX4fzGFixH/399vfY6Kjjm8Y2RCXzhvH3RqEQJUOyfPFQY6M3j30Lsb6VSRWim5xEjJdFPUhpoJfSs0QjRCKcQxGXKDc1OQlfXUkqJnwCY+W2FByvCdAk63jQUTTmEoxDtZXKxIqYogoxP5IzzT+ZQmGvNBTsjKvsip1Gnz8ed4TNYexPHKkt4hOf73ewVAqLwN58fk8wVF1YZyLh+MY1bbclw1i8r+un7DEu7uw82DJNO/PM4KAdMIXkVexZrI/lRF8QEzEbGDvH+SO8vCANKYoNNhDypk1RBqgk1XxAFRNtftb1ieeMXRHyuTEyrKqvI7J8zUNITfIWkucMY/wFYwN43LafuAu3Oikd+875tGFZTTidqFC+gKQMvr5fnH+YYWwkwflDdBehlmEFcFX8gbsXH7isqqGb9fXtuBfK0TilVZz/AgwAM0Qm2/mw9RoAAAAASUVORK5CYII=", subdir: '常用功能' },
            {name: '错误控制', command: "toJavaScriptConsole();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAADbklEQVQ4jZXUS09TCRTA8UPShMBi1i7mQ7hhNcQMPmaiqVFDDDHER4ghWmxa+6BXevuilIulra0tfV36flFoeYmYGF3wCQQLOt+AGb/EfxaC3erivzy/5CzOEREZmLHYjLZZ5dTmesEvNauczlhsRhEZEBExWByzp7tv3/HpqMfh52MOeyccHX+hd/KV3sk/Z33l6PgLh70TDj8f8+mox+7bd1gcs6ciYhARGTTbHXw8OKCx3qXV2aS9uc3G9i6dnTd0d/fo7u7R2XnDxvYu7c1tWp1NGutdPh4cYLY7EJFBEZEhk/U5++8/UG60qLba1Nc7NDe+o2vdLda6W7Q6mzQ3utTXO1RbbcqNFvvvP2CyPkdEhkREhqdnzGzt7ZMtVdCrdYr1JqVGi0qrTXVtneraOpVWm1KjRbHeRK/WyZYqbO3tMz1jRkSGRUSGp56YaG/tkMjqpPQimUKZXKlKvlxDr9TRK3Xy5Rq5UpVMoUxKL5LI6rS3dph6YupDDx9PU2tvEI6niKUyxNM5ElmdZG6VVL5AKl8gmVslkdWJp3PEUhnC8RS19gYPH0/3oclHU5TqTRbCMbRYgnA8SeT1CtFkmlgqQyyVIZpME3m9QjieRIslWAjHKNWbTD6a6kMT9x+wUqqgLmj4tWWC4SihyCsWo3G0WAItlmAxGicUeUUwHMWvLaMuaKyUKkzcf9CHxu9NEknrOD0B5gIh1KCGN/QSv7ZMYClCYCmCX1vGG3qJGtSYC4RwegJE0jrj9yb70O27EyzG01gVFYfqx+UL8iIQwh3UUBeWUBeWcAc1XgRCuHxBHKofq6KyGE9z++5EHzLeGWd+OcEzh4JVUbG7fTg9gR/gOeD0BLC7fVgVlWcOhfnlBMY7433o+s1b+JeiPLXYMTsUrC439jkvTtXHrMfPrMePU/Vhn/NidbkxOxSeWuz4l6Jcv3mrD129YWQ+Esdkc2J2KlgVN3a3B6fqw+UN4PIGvkNuD1bFjdmpYLI5mY/EuXrD+AMaunTtr//m/EGS+QLpfIHsaolcsYJerlGo1ClU6ujlGrlihexqiXS+QDJfYM4f5NK1v7+dn8jgxZGRydE/x76Njl1hdOzyT3aFP8Yu/3txZGTy/GgNIvKbiFwQkd9/sQtnswY5e0qGM3XobN+faehsxiAiA/8DDnCW2sYeE5QAAAAASUVORK5CYII=", subdir: '常用功能' },
            {name: '安全模式', command: "safeModeRestart();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdVJREFUeNpi/P//PwMlgAVELCvhxCYnYOyrcv/7p18PDf1uGQH5/9AVgCwHG8DOjqlbVleiX9nsr8Dv7z8ENvVKpFw993YWNluYcLjMQMGIL+HKpbcMz1/+YNAwZekCigljU8gIcsbGBg4UQXkD2f3/RH86hMSCHchw5fh3hmPr/rVfOvG+qnjRbxQvYHNBgLwuq4OUyBcGFhYWBiYmJgbGf78YVA1ZK4Fyqli98PLBbzBmY2djUDaV62dlecXAw/6PgZ3tLwMnx3+Gv7//MghLfmMwcxDuB7kaXxjUy6gzKPz9+ZPh3+9/DEICf8H4369/QP4fBiU9Bu852SyuuAwQUDYVL/j/8ylY899ffxm4gEEDwhAD/jFwcX1m0LUU7EXWB4lGVgYGGS2+fhHJbwIgxTBQl/0OTIM0wwNY46/OsnLulOtXv81CdoGBoj5/wp8vr8E2gwz5+OE/Q2KlFBiDxMDiQIOY/39l0DBgh0cr2AA5La56Hp5PEKcCMSjQuFj/MIiLMIExzAswgyTlfvKrqTCmwb3w6umXGwynGS8zwsIXSjdG3wDT1y9DhaEK/vz6zvDoxf+38IQElAC5hAM9ivAAUA78AdT7j5HS3MjEQCEACDAARiHN32xs5wAAAAAASUVORK5CYII=", subdir: '常用功能' },
            {name: 'separator', subdir: '常用功能' },
		    {name: '帮助支持', command: "getBrowser().selectedTab = getBrowser().addTab ('http://support.mozilla.org/zh-CN/products/firefox')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAvhJREFUeNp8U11IU1Ec/51z792mzm02taVm2YeKDz1oKyKU6smwwCIsyoKg6EESpIQeCnrwoUDCMIWwDAoKKSPfKsmPspdQoqgg0bBkc2vTfTg3d79O5w4VitGFyznw//8+/r9zDmGMId1ntuauNzlcG0AIkcM+f3Ix4E3XR/4lcFbsrys+2NRiKXG7Vclh0xkBSYZjyz8/fvK+7u5c+PKqLy0BoSZzWcP1Tldt8/lg3AIlvoSCTBWSAMzFRchCJmxmFcHh7r5f/VcvaEoiYuDEVaayE2338msvN3o8EZTnxHCt3oKdm62gAsWUX8bN4QiGZgTk7Gs5zojFwSc7xMXVlANHifvAjiuDbwJBBQJUPD+bhdICG8ZnVSQUhuotEgKLCg73hBGRCUwmM6a76k7Fpt8+poZ6QfWZi3FuE6qKomwGW1YmhiaTONkbQENPACOTCeRlSyjL4/RJBeC52CtPN3EXVBQkS3Zl68heeSkOCRp8YaCu0w9VB3SZwe3SsC2XYEkF/CEFEuOFZBzW4qoqYrJupGKGIx+i3QFFBtE0MI6Ukyr/NZQ7VXQ35qJonQWdg2H88CW5iA7CnUomq1kw2wtFcEZNVkBEzmywE/AcAFnRca7GjiJnFtpfhnB/OIRME+UivGgcnJbaMKrEQ34lPDdvhGE4WHWRY2bYXerA9ALDw5EFZFAGqnMBTecrjysaSGjxkJfqmhILfx8dFYiYAhsNxqpxB+0Dftx46uGEGgTD3YoA5b3R6bFxpiVmU6fgn3h0azno0Snomgsj0MpNAtxbRZiJIbkC5jMqkSDmJx508Cugpwjk6OwHz7uOO9AFPj/lmWhw2SiO1rhwpNoFu4WkXKQEmATvWFe/HJp68fdVJkS0b69vK66+1GpxFFCOQK3bjlhCx+jnKATRhOTib8y+v90b+vqkheOiaR+TZC2sya041mwr2rVHFXOc1LgtWiS86BmfCH57dleOzAz89zWuFQhxEjHLxbeUqUsB3udL1/dHgAEAv3J3tjHkbiIAAAAASUVORK5CYII=", subdir: '常用功能' },
		    {name: '关于火狐', command: "openAboutDialog();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA25JREFUeNosU1toHFUY/s6ZM7szuzs72e4t1zVGrZEoRBOQUo1W0QpSKIKXBymKmPrgQ9EKaV4EH4w+CH2Qgn0Q8fbSSrFQ8RJtaQm1thVrSwJtitnGbDbJZm+zO/eZ48zggZ/znfNfz3++n3DOceu1/EkAc/d9sXV18uDxycGVP9/sS3WmLuemCsE9XMddcW2nDI5TUkr+Kry78tl0uIH8H4CHhyN3nv9QU4uvfKp+PnLthgbt5HZkVK21ceG3RSzfXMPkP9//fED54QPHNBdCHf1IEl4NQWbEx1zpzGzoHGLb9rDVdVHrOLDAkOwrIG63MHtAe9aW0vPqUPalKEBCEZ6kqhBlyj+sInUvi7Bp+ci9sAPfjWehcwKiSAAT4Q7fhfGXxyTdpMfzY4VemkyTCTFFfaZm4No+PJ3Cs4DHd+2I5BEV2NBcOIIIW5Dw43UVudEiMgOyamnOEZrKkP644tMordEGNzlss4jcc2/gwsU61r/dRKvtYbtiwA8qWFy20Wq5GJjIwtWMPSye9NOgXuRvWwTCWCnCTFyEGAe2VuvgnSY6lQo8X8DVJQo5sKcZCZbujTImO3H4gOA38Nd5HbVvrsCNR5+Cw4PvQz53HowJIKYG2xMw3KOjJ11H0zDg2S6jgarTWHPgBNkffExGXvGhKMA7hRlQScbRzhzmkl/D6nThGl08MXgHaNRhlzfAYkRn1MKv1WV7f2GAIaVS5EoxFAnB2cQxJCUXbV/G3/Nn4d39NMR2GQfHl2BVbWxfqwcM868zFzhhNqy96zeZ3LczhtKEgtYax2a1i3LZQ72pYyY7g9ftE9i3T0dWsNC81UT5Ng0qLP5CTu9FAjpZSLD4+OijEmKSAMsIxBRx+VIL6FWQIF2UCg6Gh+MwAlKt39YCksntnmz+/pA1uhnjb7UN6zT+4IXSAxIU1UfQXOx+Kg5GTDgmgRsE1DY86NRBXXPNpZr29j31ZjWi3Yvz/NKhh8j0Tss+Ztxw+9UYQyYdtJcScJGAMgLPc1AzOBoG9DMr/qH9JR4NVfiEaDWsIcmudvbobutoKo3BbJonaIyDhEpOYYPamxVsi7TnPTErn8rEV/UowEgiMsHC/E/o3fUM3h1i/UGfdkscUyLQF85LwOx/LUp+92P83CerbmX5y48xfXgWawFr/xNgANPvgmYH0Mg8AAAAAElFTkSuQmCC", subdir: '常用功能' },
          
        // 建议把要放在子目录下的功能按钮,定义在上面, 下面的定义放在主菜单下的最常用的功能按钮,
		    {name: 'separator'},
		    {name: '书签管理', command: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');", image: "chrome://browser/skin/places/allBookmarks.png"},
            {name: '历史记录', command: "PlacesCommandHook.showPlacesOrganizer('History');",  image: "chrome://browser/content/abouthome/history.png"},
            {name: '下载管理', command: "BrowserDownloadsUI();", image: "chrome://browser/skin/places/downloads.png" },
            {name: '附加组件', command: "getBrowser().selectedTab = getBrowser().addTab ('about:addons')", image: "chrome://mozapps/skin/extensions/extensionGeneric-16.png"},
            {name: 'separator'},
		    {name: '选项设置', command: "openPreferences();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADE0lEQVQ4jaXMTUhqaQDG8RfufmZ2bYpDSYkfCzlConCyz4XaIUQPBKVtMsjVDEjQIsl4tbA61GRGC4PatIo+IMvoSOmx9JxFQYtcFCG0nbu9cN/0mUXM4sJlYJgH/ruHHyGEEEmSviwuLv7yX5Ik6QshhJBIJGI5OjrSVVX9WqlU/lJV9eu/9c/n+PhYj0QiFiKK4lq9Xsfa2hoSiQQopaCUYnl5GclkEpRSpFIppFIpUEqRSCSwurqKer0OURTXSDAYlHVdb5pMpu+dnZ0tk8nU6u7ubrW1tbU4jmtxHNdqb29vdXR0tCwWS6urq6tlMpm+a5rWDAaDMgkEArKu63C73WxoaAgOhwOCIIBSitnZWWxubmJqagozMzOwWCwYGBhAf38/0zQNgUBAJn6/X9Y0DYODg8xut2N+fh5LS0t4enrCw8MDKpUKyuUy0uk0KKXweDzo6+tjuq7/CLjdbuZyuZBIJPDx8YGXlxdks1nEYjHs7+/j7e0Nl5eX4Hkevb29rFarwe/3y2RsbEzWdR08z7OFhQU8Pj7i+fkZk5OT4DgORqMRVqsVlFJkMhns7OwgHo+zUqn0CYiiKN/f38PlcrHp6WlomoatrS1wHIdcLgdN0zAyMgJZlvH6+or393ecnJywWq0GURQ/gUqlAqfTydbX13F7e4tYLIaenh5omoZGo4F4PI5yuYxms4m9vT2Mj4+zarUKn88nE5/PJ9/d3cHhcLCJiQmoqorDw0MYjUZIkoRoNIq5uTk0Gg3kcjkIgoBwOMxKpdIn4PV610ulEmw2GwuFQkgmk6hWq9jd3YXT6YTBYMDKygpubm4QDochSRJOT0+Zoijwer3rxOPx/KmqanN4ePibwWBgoVCIbWxssIODA3Z2dsZkWWbRaJTJsszS6TRzuVzMarV+U1W1OTo6ukkEQfg9n8+jUCigUCigWCzi/Pwc+XweiqLg+voaiqLg6uoKxWIRiqLg4uIC+XwegiD8QQghv5rN5pjdbs/yPJ+x2WzbPM9v8zy/bbPZflbGbrdnzWZzjBDyG/m/+xsCyiIj0Yng5AAAAABJRU5ErkJggg=="},
		    {name: '参数设置', command: "getBrowser().selectedTab = getBrowser().addTab ('about:config')", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABxElEQVQ4jZXQzYsScRzH8d/f16lTFCwRdOoSUYddtlrUaXTVEdR1xqfysLtUrC2EujNjbplPjIGtJIZB6YLMjqu105/w7tQhMB8+99f7C18hVpiiKGiaRjqdJplMsor5B6dSKWzbxnVdVFVdL6CqKuPxmMlkgmmaxOPx9QKapmHbNt1uF0VREEKISCRCOBxmd3d3eSyRSDAcDmk2m4RCIYLBIPl8nsFggCzLiwOyLBOLxej3+7TbbSqVCuVymVqtRqPRQJKk+QE5bSLnPhGNRrEsi06ng2VZtFot6vU61WoVn883Hz/TDLLmhOSJQ/j1N3q9HqVSiUAggCzLSJKE1+udjyXNIKs7VLq/KZ+5hI/HbGd6+P3+5c/yqQYp3eHdmcvL6pT900sK7V94Ds656/+4OOBN6CSLDuXPLocfpqjFC56bE45bP9nKjbjjNf8f2Eno7BUcjI7L4fspe4ULMrrDm8aMzRcjbnuMxde3ckP0zhX7p5fE3tqkTxzy9RmPsiM2dpZgIYS4r32n0L4iY0xIFh2O6jMeZkfceroCFkKIe4qF5+Cco9qMV9UZD1I/uPl4Rfx3G7LFdd9Xrj35wo3t9fAfyK1fDftrXK0AAAAASUVORK5CYII="},
            {name: '清理痕迹', command: "Cc['@mozilla.org/browser/browserglue;1'].getService(Ci.nsIBrowserGlue).sanitize(window);", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAQAAAAEABcxq3DAAACjUlEQVQ4y32TS0iUURTH/+d83/jNjGMjEaJZPnqalQZOD1GMTIogRSqEQmhXKxduXCRCFKYQ2LrCTZIFQZQiBkERYUnmYzCLLB2dYZwpJ2byMY8+594Wzsio2X9zz338f5xz77nAGsnxzQ1B1+XDPr9sO1leUVt7tWpvc//2tq6xekdInyvH/zTy9tp5MQKpf82W3Z3lsmB/qWzurZZ37ZekPi/lm4+T7Q333u9M9FA86Bn41VnATy8Kax7Ss0tFyFXF4ehZ4bcWsdMzIDShcX7GBdgH3yGce7qmMp+eAACvpC4jx6RpD9w/VIyNDvNn901Ut97nfcdt6H7dwy9GGvDwZRYyMtMw9TNii/vUeHCrV3GcsxXmFmeHEf3jE+Gok48UZYmyo/lcueuKMG/J446uJtGnl3Df4sDEOkCqRZn+5AxhIZKMtJQc/uJIhme2kSdcXtzpGGI93A8DZ/GpsiZcLzlw6HHMt1KCynAoTDAwQ1VYECQCwZD4HQojKnShGjVYrJpwhE7AHqgxPWpF6ipAdMHtADEACQnJzAQiMAEgVhjE4CQLa4YonPOF9Wdshh2rALrfOQligAApIWLLsZEEiMCqSViMhBt1jYHUCn1oFWDONzWpKhx7ETBRYokxMhEbVAok9sEKoP9BnZcVBiQgAMEUz0ACRAIAJAgq8/Q/AQDAnDQDAqQA03KPxfaXyUQCRk1zbAiIBP3jRAwpIYgT7wBCSiDJYEDQM7oxYPBZy7BpkxnEChMBMl47wIrCyNmWDvvzlm+JHiVx4v3+oX/O583dfbA4j7UUnvHNYyEYgsqEdHMg6H7V0j47PXYbgL7uM61RpqYZC83WtK1CLMlF/4xrKYpRAJ61B/8CuYEC8ekMENAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTAtMDItMTBUMDU6MzY6MjctMDY6MDB0CLIaAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDA4LTExLTAyVDE2OjUxOjU5LTA2OjAwkQS7ewAAAABJRU5ErkJggg==" },
		    {name: '重启火狐', command: "Application.restart();", image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMOSURBVDhPhZNrSJNRGMefudUG5S0T1AINLMtL2IyEEEy/BUH0xbsoliQYBBl9CqMSS9ShUkIg+qkLMWgWZEQUVop+COfKS0PndJtus225uzn995x5o0+98Oe855zn+T3n/N/nJX4k9yIjHzw7cCDwJi4OmoMHoYmPD4/qmBioo6PxKjYWGtYrfu+PjMTL/fvRolC8vkR0mFKIkgdyc50rnZ1Y7ujAr0eP4Ozqgr2vD0atFnM/f8Lc2wtrQwMs167BdPkyLGVlGFIqN24RldFpolNfjx2D7epVmGpqsFBfj9nWVhhbWuAyGuH1+bDAcP3t25iprMRsfj6M585Bf/QomolukJIoZ5An1upqGGtrYejvxwJXne/uhsdgwCoDTHyq+eFhzA0NQc/V5/LyMM0593cAKSmwFBfD0NMDVzAIr9MJk0oFNwOCfj/mm5rgGB2FD4BBo8FURgZ+sD87gE9JSVioq4OdEzY4yKFWY6a8HB6bDWs81xcVwVBSgnWGrwQCmLxwAWNEu4CP7Li5uRn+tTUELBZMZWdDy24vPnkCx9u3+MEVRYJrYAAhBs63tUG7DchlwAeFAhYGiGrOz5+hjYoKJ2hlsrDEu5CpvR3rHGN9/hxaiWQX8I43jVVVYYCLDdQlJ28CthLDIydYXrwIAxYfP/73BO95MpOeDj/fOcgB+sZG6CIi8J3XhXSsiYsX8Xt5efMK/DnF2q4HTDew7Pz9hYlOlwv6hw8xWViIybNnMX39Oqx8MlF9ZXAQs+zZ1PYVBOALt+aSVAojt6t765gels1qxZLZDFcoFL5eYGwMZqUSJq5u4La+KwCZRKdHEhKwwtQl3rCxgW5u2z/cOCGHAyG3G2sTE/Bym9u5eUSMUy7HIvt0h+gm7SPKfJmY6AqcOQN/Vha8x4/Dk5oKX0EBAqWlCFZUwH/+PDzskZcBPo5ZzcnBSFoayolqxN8YXySRPGiWy791KhQ6lUIxrtq7d1xFFFb71qiSSsfFXsdmjPaKTPb0CNFJAdgjIKwTLLGQ9R+JGL45HSIi+V83JDdbDODDxQAAAABJRU5ErkJggg==" },  
		],
      },
	_externalAppPopup: null,
	_isready: false,
      init: function() {
        this.handleRelativePath(this.toolbar.apps);
        const XULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
        var navigator = document.getElementById("navigator-toolbox");
		if (!navigator || navigator.palette.id !== "BrowserToolbarPalette") return;
		var ExternalAppBtn = document.createElementNS (XULNS, 'toolbarbutton');
		ExternalAppBtn.id = "ExternalAppbtnMEx";
		ExternalAppBtn.setAttribute("label","扩展程序按钮");
	        ExternalAppBtn.setAttribute("onclick", "event.preventDefault();event.stopPropagation();");
		ExternalAppBtn.setAttribute("tooltiptext","扩展程序按钮,可以自定义扩展程序和功能");
		ExternalAppBtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional");
		ExternalAppBtn.setAttribute("type", "menu");
		ExternalAppBtn.setAttribute("removable", "true");
	        ExternalAppBtn.style.listStyleImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA3SURBVDhPYxhhICEhQTYpKel/XFwc0RikHqQPagQCDF7DBi8YvGFGVcMGLxi8YUZVw4YzYGAAAC5iDJ8LDQq6AAAAAElFTkSuQmCC)";
		navigator.palette.appendChild(ExternalAppBtn);

		var ExternalAppPopup = document.createElementNS (XULNS, 'menupopup');
	   ExternalAppPopup.setAttribute('onpopupshowing','event.stopPropagation();gExternalAppbuttonMEx.onpopupshowing();');
	   this._externalAppPopup = ExternalAppPopup;
   	ExternalAppBtn.appendChild(ExternalAppPopup); 

      },

	onpopupshowing: function() {	   
 	   if (this._isready ) return;
 	   if ( this._externalAppPopup == null ) return;
 	   var ExternalAppPopup = this._externalAppPopup;
         for (var i=0; i<this.toolbar.subdirs.length; i++) {
          if (this.toolbar.subdirs[i].name == 'separator') {
            ExternalAppPopup.appendChild(document.createElement('menuseparator'));
          }
          else {
            var subDirItem = ExternalAppPopup.appendChild(document.createElement('menu'));
            var subDirItemPopup = subDirItem.appendChild(document.createElement('menupopup'));
            subDirItem.setAttribute('class', 'menu-iconic');
            subDirItem.setAttribute('label', this.toolbar.subdirs[i].name);
            subDirItem.setAttribute('image', this.toolbar.subdirs[i].image);
            gExternalAppbuttonMEx.subdirPopupHash[this.toolbar.subdirs[i].name] = subDirItemPopup;
            gExternalAppbuttonMEx.subdirMenuHash[this.toolbar.subdirs[i].name] = subDirItem;
          }
        }
 
 
        for (var i=0; i<this.toolbar.apps.length; i++) {
        	var appsItems;
          if (this.toolbar.apps[i].name == 'separator') {
          	  appsItems = document.createElement('menuseparator');
          }
          else {
            appsItems = document.createElement('menuitem');
            appsItems.setAttribute('class', 'menuitem-iconic');
            appsItems.setAttribute('label', this.toolbar.apps[i].name);
            appsItems.setAttribute('image', 'moz-icon:file://' + this.toolbar.apps[i].path + '?size=16;');
            appsItems.setAttribute('oncommand', "gExternalAppbuttonMEx.exec(this.path, this.args);");
            appsItems.setAttribute('tooltiptext', this.toolbar.apps[i].name);
            appsItems.path = this.toolbar.apps[i].path;
            appsItems.args = this.toolbar.apps[i].args;
          }
	  if (  this.toolbar.apps[i].subdir && gExternalAppbuttonMEx.subdirPopupHash[this.toolbar.apps[i].subdir]  )
               gExternalAppbuttonMEx.subdirPopupHash[this.toolbar.apps[i].subdir].appendChild(appsItems);
         else
          	  ExternalAppPopup.appendChild(appsItems);
        }

        for (var i=0; i<this.toolbar.configs.length; i++) {
        	var configItems;
          if (this.toolbar.configs[i].name == 'separator') {
            configItems = document.createElement('menuseparator');
          }
          else {
            configItems= ExternalAppPopup.appendChild(document.createElement('menuitem'));
            configItems.setAttribute('class', 'menuitem-iconic');
            configItems.setAttribute('label', this.toolbar.configs[i].name);
            configItems.setAttribute('image',this.toolbar.configs[i].image);
            configItems.setAttribute('oncommand', this.toolbar.configs[i].command );
            configItems.setAttribute('tooltiptext', this.toolbar.configs[i].name);
          }
	    if (  this.toolbar.configs[i].subdir && gExternalAppbuttonMEx.subdirPopupHash[this.toolbar.configs[i].subdir]  )
               gExternalAppbuttonMEx.subdirPopupHash[this.toolbar.configs[i].subdir].appendChild(configItems);
           else
          	   ExternalAppPopup.appendChild(configItems);
        }

	if ( this.autohideEmptySubDirs )
	{
		for (let [name, popup] in Iterator(gExternalAppbuttonMEx.subdirPopupHash )) {
			//Application.console.log("popup: " + popup);
			if ( popup.hasChildNodes() ) {
			   continue;
			}
			else {
			    gExternalAppbuttonMEx.subdirMenuHash[name].setAttribute("hidden", "true");	
			} 
		}
	}

	if ( this.moveSubDirstoBottom )
	{
		let i = ExternalAppPopup.childNodes.length;
		while ( ExternalAppPopup.firstChild.getAttribute('class') != 'menuitem-iconic' && i-- != 0 )
		{
			ExternalAppPopup.appendChild(ExternalAppPopup.firstChild);
		}
	}
	this._isready = true;
	},

      handleRelativePath: function(apps) {
        for (var i=0; i<apps.length; i++) {
          if (apps[i].path) {
            apps[i].path = apps[i].path.replace(/\//g, '\\').toLocaleLowerCase();	
            var ffdir = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile).path;
 		 if (/^(\\)/.test(apps[i].path)) {
              apps[i].path = ffdir + apps[i].path;
            }
          }
        }
      },

      exec: function(path, args) {
            args = args || [];
            var args_t=args.slice(0);
        for (var i=0; i<args_t.length; i++) {
          args_t[i] = args_t[i].replace(/%u/g, gBrowser.currentURI.spec);
        }

        var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
        file.initWithPath(path);
        if (!file.exists()) {
          Cu.reportError('File Not Found: ' + path);
          return;
        }

        if (!file.isExecutable()) {
          file.launch();
        }
        else {
          var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
          process.init(file);
          process.run(false, args_t, args_t.length);
        }
      },
    };

    	function updateToolbar() {
        var toolbars = document.querySelectorAll("toolbar");
        Array.slice(toolbars).forEach(function (toolbar) {
            var currentset = toolbar.getAttribute("currentset");
            if (currentset.split(",").indexOf("ExternalAppbtnMEx") < 0) return;
            toolbar.currentSet = currentset;
            try {
                BrowserToolboxCustomizeDone(true);
            } catch (ex) {
            }
       });
    }
    gExternalAppbuttonMEx.init();
    updateToolbar();