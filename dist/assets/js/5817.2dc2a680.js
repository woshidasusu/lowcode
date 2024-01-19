"use strict";(self["webpackChunklowcode"]=self["webpackChunklowcode"]||[]).push([[5817],{55817:function(e,t,n){n.r(t),n.d(t,{CompletionAdapter:function(){return Ee},DefinitionAdapter:function(){return Ne},DiagnosticsAdapter:function(){return be},DocumentColorAdapter:function(){return $e},DocumentFormattingEditProvider:function(){return qe},DocumentHighlightAdapter:function(){return Fe},DocumentLinkAdapter:function(){return ze},DocumentRangeFormattingEditProvider:function(){return Xe},DocumentSymbolAdapter:function(){return Ke},FoldingRangeAdapter:function(){return Qe},HoverAdapter:function(){return Pe},ReferenceAdapter:function(){return Ue},RenameAdapter:function(){return Ve},SelectionRangeAdapter:function(){return Ye},WorkerManager:function(){return W},fromPosition:function(){return Ae},fromRange:function(){return xe},setupMode:function(){return bt},toRange:function(){return Ie},toTextEdit:function(){return Re}});var r=n(35026),i=(n(6484),n(75486)),o=Object.defineProperty,a=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,u=Object.prototype.hasOwnProperty,c=(e,t,n,r)=>{if(t&&"object"===typeof t||"function"===typeof t)for(let i of s(t))u.call(e,i)||i===n||o(e,i,{get:()=>t[i],enumerable:!(r=a(t,i))||r.enumerable});return e},d=(e,t,n)=>(c(e,t,"default"),n&&c(n,t,"default")),g={};d(g,i);var l,f,h,p,m,v,w,k,_,b,C,y,E,A,x,I,S,T,R,D,P,M,j,L,F,O,N=12e4,W=class{constructor(e){(0,r.Z)(this,"_defaults",void 0),(0,r.Z)(this,"_idleCheckInterval",void 0),(0,r.Z)(this,"_lastUsedTime",void 0),(0,r.Z)(this,"_configChangeListener",void 0),(0,r.Z)(this,"_worker",void 0),(0,r.Z)(this,"_client",void 0),this._defaults=e,this._worker=null,this._client=null,this._idleCheckInterval=window.setInterval((()=>this._checkIfIdle()),3e4),this._lastUsedTime=0,this._configChangeListener=this._defaults.onDidChange((()=>this._stopWorker()))}_stopWorker(){this._worker&&(this._worker.dispose(),this._worker=null),this._client=null}dispose(){clearInterval(this._idleCheckInterval),this._configChangeListener.dispose(),this._stopWorker()}_checkIfIdle(){if(!this._worker)return;let e=Date.now()-this._lastUsedTime;e>N&&this._stopWorker()}_getClient(){return this._lastUsedTime=Date.now(),this._client||(this._worker=g.editor.createWebWorker({moduleId:"vs/language/json/jsonWorker",label:this._defaults.languageId,createData:{languageSettings:this._defaults.diagnosticsOptions,languageId:this._defaults.languageId,enableSchemaRequest:this._defaults.diagnosticsOptions.enableSchemaRequest}}),this._client=this._worker.getProxy()),this._client}getLanguageServiceWorker(...e){let t;return this._getClient().then((e=>{t=e})).then((t=>{if(this._worker)return this._worker.withSyncedResources(e)})).then((e=>t))}};(function(e){e.MIN_VALUE=-2147483648,e.MAX_VALUE=2147483647})(l||(l={})),function(e){e.MIN_VALUE=0,e.MAX_VALUE=2147483647}(f||(f={})),function(e){function t(e,t){return e===Number.MAX_VALUE&&(e=f.MAX_VALUE),t===Number.MAX_VALUE&&(t=f.MAX_VALUE),{line:e,character:t}}function n(e){var t=e;return ke.objectLiteral(t)&&ke.uinteger(t.line)&&ke.uinteger(t.character)}e.create=t,e.is=n}(h||(h={})),function(e){function t(e,t,n,r){if(ke.uinteger(e)&&ke.uinteger(t)&&ke.uinteger(n)&&ke.uinteger(r))return{start:h.create(e,t),end:h.create(n,r)};if(h.is(e)&&h.is(t))return{start:e,end:t};throw new Error("Range#create called with invalid arguments["+e+", "+t+", "+n+", "+r+"]")}function n(e){var t=e;return ke.objectLiteral(t)&&h.is(t.start)&&h.is(t.end)}e.create=t,e.is=n}(p||(p={})),function(e){function t(e,t){return{uri:e,range:t}}function n(e){var t=e;return ke.defined(t)&&p.is(t.range)&&(ke.string(t.uri)||ke.undefined(t.uri))}e.create=t,e.is=n}(m||(m={})),function(e){function t(e,t,n,r){return{targetUri:e,targetRange:t,targetSelectionRange:n,originSelectionRange:r}}function n(e){var t=e;return ke.defined(t)&&p.is(t.targetRange)&&ke.string(t.targetUri)&&(p.is(t.targetSelectionRange)||ke.undefined(t.targetSelectionRange))&&(p.is(t.originSelectionRange)||ke.undefined(t.originSelectionRange))}e.create=t,e.is=n}(v||(v={})),function(e){function t(e,t,n,r){return{red:e,green:t,blue:n,alpha:r}}function n(e){var t=e;return ke.numberRange(t.red,0,1)&&ke.numberRange(t.green,0,1)&&ke.numberRange(t.blue,0,1)&&ke.numberRange(t.alpha,0,1)}e.create=t,e.is=n}(w||(w={})),function(e){function t(e,t){return{range:e,color:t}}function n(e){var t=e;return p.is(t.range)&&w.is(t.color)}e.create=t,e.is=n}(k||(k={})),function(e){function t(e,t,n){return{label:e,textEdit:t,additionalTextEdits:n}}function n(e){var t=e;return ke.string(t.label)&&(ke.undefined(t.textEdit)||T.is(t))&&(ke.undefined(t.additionalTextEdits)||ke.typedArray(t.additionalTextEdits,T.is))}e.create=t,e.is=n}(_||(_={})),function(e){e["Comment"]="comment",e["Imports"]="imports",e["Region"]="region"}(b||(b={})),function(e){function t(e,t,n,r,i){var o={startLine:e,endLine:t};return ke.defined(n)&&(o.startCharacter=n),ke.defined(r)&&(o.endCharacter=r),ke.defined(i)&&(o.kind=i),o}function n(e){var t=e;return ke.uinteger(t.startLine)&&ke.uinteger(t.startLine)&&(ke.undefined(t.startCharacter)||ke.uinteger(t.startCharacter))&&(ke.undefined(t.endCharacter)||ke.uinteger(t.endCharacter))&&(ke.undefined(t.kind)||ke.string(t.kind))}e.create=t,e.is=n}(C||(C={})),function(e){function t(e,t){return{location:e,message:t}}function n(e){var t=e;return ke.defined(t)&&m.is(t.location)&&ke.string(t.message)}e.create=t,e.is=n}(y||(y={})),function(e){e.Error=1,e.Warning=2,e.Information=3,e.Hint=4}(E||(E={})),function(e){e.Unnecessary=1,e.Deprecated=2}(A||(A={})),function(e){function t(e){var t=e;return void 0!==t&&null!==t&&ke.string(t.href)}e.is=t}(x||(x={})),function(e){function t(e,t,n,r,i,o){var a={range:e,message:t};return ke.defined(n)&&(a.severity=n),ke.defined(r)&&(a.code=r),ke.defined(i)&&(a.source=i),ke.defined(o)&&(a.relatedInformation=o),a}function n(e){var t,n=e;return ke.defined(n)&&p.is(n.range)&&ke.string(n.message)&&(ke.number(n.severity)||ke.undefined(n.severity))&&(ke.integer(n.code)||ke.string(n.code)||ke.undefined(n.code))&&(ke.undefined(n.codeDescription)||ke.string(null===(t=n.codeDescription)||void 0===t?void 0:t.href))&&(ke.string(n.source)||ke.undefined(n.source))&&(ke.undefined(n.relatedInformation)||ke.typedArray(n.relatedInformation,y.is))}e.create=t,e.is=n}(I||(I={})),function(e){function t(e,t){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];var i={title:e,command:t};return ke.defined(n)&&n.length>0&&(i.arguments=n),i}function n(e){var t=e;return ke.defined(t)&&ke.string(t.title)&&ke.string(t.command)}e.create=t,e.is=n}(S||(S={})),function(e){function t(e,t){return{range:e,newText:t}}function n(e,t){return{range:{start:e,end:e},newText:t}}function r(e){return{range:e,newText:""}}function i(e){var t=e;return ke.objectLiteral(t)&&ke.string(t.newText)&&p.is(t.range)}e.replace=t,e.insert=n,e.del=r,e.is=i}(T||(T={})),function(e){function t(e,t,n){var r={label:e};return void 0!==t&&(r.needsConfirmation=t),void 0!==n&&(r.description=n),r}function n(e){var t=e;return void 0!==t&&ke.objectLiteral(t)&&ke.string(t.label)&&(ke.boolean(t.needsConfirmation)||void 0===t.needsConfirmation)&&(ke.string(t.description)||void 0===t.description)}e.create=t,e.is=n}(R||(R={})),function(e){function t(e){var t=e;return"string"===typeof t}e.is=t}(D||(D={})),function(e){function t(e,t,n){return{range:e,newText:t,annotationId:n}}function n(e,t,n){return{range:{start:e,end:e},newText:t,annotationId:n}}function r(e,t){return{range:e,newText:"",annotationId:t}}function i(e){var t=e;return T.is(t)&&(R.is(t.annotationId)||D.is(t.annotationId))}e.replace=t,e.insert=n,e.del=r,e.is=i}(P||(P={})),function(e){function t(e,t){return{textDocument:e,edits:t}}function n(e){var t=e;return ke.defined(t)&&H.is(t.textDocument)&&Array.isArray(t.edits)}e.create=t,e.is=n}(M||(M={})),function(e){function t(e,t,n){var r={kind:"create",uri:e};return void 0===t||void 0===t.overwrite&&void 0===t.ignoreIfExists||(r.options=t),void 0!==n&&(r.annotationId=n),r}function n(e){var t=e;return t&&"create"===t.kind&&ke.string(t.uri)&&(void 0===t.options||(void 0===t.options.overwrite||ke.boolean(t.options.overwrite))&&(void 0===t.options.ignoreIfExists||ke.boolean(t.options.ignoreIfExists)))&&(void 0===t.annotationId||D.is(t.annotationId))}e.create=t,e.is=n}(j||(j={})),function(e){function t(e,t,n,r){var i={kind:"rename",oldUri:e,newUri:t};return void 0===n||void 0===n.overwrite&&void 0===n.ignoreIfExists||(i.options=n),void 0!==r&&(i.annotationId=r),i}function n(e){var t=e;return t&&"rename"===t.kind&&ke.string(t.oldUri)&&ke.string(t.newUri)&&(void 0===t.options||(void 0===t.options.overwrite||ke.boolean(t.options.overwrite))&&(void 0===t.options.ignoreIfExists||ke.boolean(t.options.ignoreIfExists)))&&(void 0===t.annotationId||D.is(t.annotationId))}e.create=t,e.is=n}(L||(L={})),function(e){function t(e,t,n){var r={kind:"delete",uri:e};return void 0===t||void 0===t.recursive&&void 0===t.ignoreIfNotExists||(r.options=t),void 0!==n&&(r.annotationId=n),r}function n(e){var t=e;return t&&"delete"===t.kind&&ke.string(t.uri)&&(void 0===t.options||(void 0===t.options.recursive||ke.boolean(t.options.recursive))&&(void 0===t.options.ignoreIfNotExists||ke.boolean(t.options.ignoreIfNotExists)))&&(void 0===t.annotationId||D.is(t.annotationId))}e.create=t,e.is=n}(F||(F={})),function(e){function t(e){var t=e;return t&&(void 0!==t.changes||void 0!==t.documentChanges)&&(void 0===t.documentChanges||t.documentChanges.every((function(e){return ke.string(e.kind)?j.is(e)||L.is(e)||F.is(e):M.is(e)})))}e.is=t}(O||(O={}));var U,V,H,K,Z,z,q,X,B,$,Q,G,J,Y,ee,te,ne,re,ie,oe,ae,se,ue,ce,de,ge,le,fe,he,pe,me,ve=function(){function e(e,t){this.edits=e,this.changeAnnotations=t}return e.prototype.insert=function(e,t,n){var r,i;if(void 0===n?r=T.insert(e,t):D.is(n)?(i=n,r=P.insert(e,t,n)):(this.assertChangeAnnotations(this.changeAnnotations),i=this.changeAnnotations.manage(n),r=P.insert(e,t,i)),this.edits.push(r),void 0!==i)return i},e.prototype.replace=function(e,t,n){var r,i;if(void 0===n?r=T.replace(e,t):D.is(n)?(i=n,r=P.replace(e,t,n)):(this.assertChangeAnnotations(this.changeAnnotations),i=this.changeAnnotations.manage(n),r=P.replace(e,t,i)),this.edits.push(r),void 0!==i)return i},e.prototype.delete=function(e,t){var n,r;if(void 0===t?n=T.del(e):D.is(t)?(r=t,n=P.del(e,t)):(this.assertChangeAnnotations(this.changeAnnotations),r=this.changeAnnotations.manage(t),n=P.del(e,r)),this.edits.push(n),void 0!==r)return r},e.prototype.add=function(e){this.edits.push(e)},e.prototype.all=function(){return this.edits},e.prototype.clear=function(){this.edits.splice(0,this.edits.length)},e.prototype.assertChangeAnnotations=function(e){if(void 0===e)throw new Error("Text edit change is not configured to manage change annotations.")},e}(),we=function(){function e(e){this._annotations=void 0===e?Object.create(null):e,this._counter=0,this._size=0}return e.prototype.all=function(){return this._annotations},Object.defineProperty(e.prototype,"size",{get:function(){return this._size},enumerable:!1,configurable:!0}),e.prototype.manage=function(e,t){var n;if(D.is(e)?n=e:(n=this.nextId(),t=e),void 0!==this._annotations[n])throw new Error("Id "+n+" is already in use.");if(void 0===t)throw new Error("No annotation provided for id "+n);return this._annotations[n]=t,this._size++,n},e.prototype.nextId=function(){return this._counter++,this._counter.toString()},e}();(function(){function e(e){var t=this;this._textEditChanges=Object.create(null),void 0!==e?(this._workspaceEdit=e,e.documentChanges?(this._changeAnnotations=new we(e.changeAnnotations),e.changeAnnotations=this._changeAnnotations.all(),e.documentChanges.forEach((function(e){if(M.is(e)){var n=new ve(e.edits,t._changeAnnotations);t._textEditChanges[e.textDocument.uri]=n}}))):e.changes&&Object.keys(e.changes).forEach((function(n){var r=new ve(e.changes[n]);t._textEditChanges[n]=r}))):this._workspaceEdit={}}Object.defineProperty(e.prototype,"edit",{get:function(){return this.initDocumentChanges(),void 0!==this._changeAnnotations&&(0===this._changeAnnotations.size?this._workspaceEdit.changeAnnotations=void 0:this._workspaceEdit.changeAnnotations=this._changeAnnotations.all()),this._workspaceEdit},enumerable:!1,configurable:!0}),e.prototype.getTextEditChange=function(e){if(H.is(e)){if(this.initDocumentChanges(),void 0===this._workspaceEdit.documentChanges)throw new Error("Workspace edit is not configured for document changes.");var t={uri:e.uri,version:e.version},n=this._textEditChanges[t.uri];if(!n){var r=[],i={textDocument:t,edits:r};this._workspaceEdit.documentChanges.push(i),n=new ve(r,this._changeAnnotations),this._textEditChanges[t.uri]=n}return n}if(this.initChanges(),void 0===this._workspaceEdit.changes)throw new Error("Workspace edit is not configured for normal text edit changes.");n=this._textEditChanges[e];if(!n){r=[];this._workspaceEdit.changes[e]=r,n=new ve(r),this._textEditChanges[e]=n}return n},e.prototype.initDocumentChanges=function(){void 0===this._workspaceEdit.documentChanges&&void 0===this._workspaceEdit.changes&&(this._changeAnnotations=new we,this._workspaceEdit.documentChanges=[],this._workspaceEdit.changeAnnotations=this._changeAnnotations.all())},e.prototype.initChanges=function(){void 0===this._workspaceEdit.documentChanges&&void 0===this._workspaceEdit.changes&&(this._workspaceEdit.changes=Object.create(null))},e.prototype.createFile=function(e,t,n){if(this.initDocumentChanges(),void 0===this._workspaceEdit.documentChanges)throw new Error("Workspace edit is not configured for document changes.");var r,i,o;if(R.is(t)||D.is(t)?r=t:n=t,void 0===r?i=j.create(e,n):(o=D.is(r)?r:this._changeAnnotations.manage(r),i=j.create(e,n,o)),this._workspaceEdit.documentChanges.push(i),void 0!==o)return o},e.prototype.renameFile=function(e,t,n,r){if(this.initDocumentChanges(),void 0===this._workspaceEdit.documentChanges)throw new Error("Workspace edit is not configured for document changes.");var i,o,a;if(R.is(n)||D.is(n)?i=n:r=n,void 0===i?o=L.create(e,t,r):(a=D.is(i)?i:this._changeAnnotations.manage(i),o=L.create(e,t,r,a)),this._workspaceEdit.documentChanges.push(o),void 0!==a)return a},e.prototype.deleteFile=function(e,t,n){if(this.initDocumentChanges(),void 0===this._workspaceEdit.documentChanges)throw new Error("Workspace edit is not configured for document changes.");var r,i,o;if(R.is(t)||D.is(t)?r=t:n=t,void 0===r?i=F.create(e,n):(o=D.is(r)?r:this._changeAnnotations.manage(r),i=F.create(e,n,o)),this._workspaceEdit.documentChanges.push(i),void 0!==o)return o}})();(function(e){function t(e){return{uri:e}}function n(e){var t=e;return ke.defined(t)&&ke.string(t.uri)}e.create=t,e.is=n})(U||(U={})),function(e){function t(e,t){return{uri:e,version:t}}function n(e){var t=e;return ke.defined(t)&&ke.string(t.uri)&&ke.integer(t.version)}e.create=t,e.is=n}(V||(V={})),function(e){function t(e,t){return{uri:e,version:t}}function n(e){var t=e;return ke.defined(t)&&ke.string(t.uri)&&(null===t.version||ke.integer(t.version))}e.create=t,e.is=n}(H||(H={})),function(e){function t(e,t,n,r){return{uri:e,languageId:t,version:n,text:r}}function n(e){var t=e;return ke.defined(t)&&ke.string(t.uri)&&ke.string(t.languageId)&&ke.integer(t.version)&&ke.string(t.text)}e.create=t,e.is=n}(K||(K={})),function(e){e.PlainText="plaintext",e.Markdown="markdown"}(Z||(Z={})),function(e){function t(t){var n=t;return n===e.PlainText||n===e.Markdown}e.is=t}(Z||(Z={})),function(e){function t(e){var t=e;return ke.objectLiteral(e)&&Z.is(t.kind)&&ke.string(t.value)}e.is=t}(z||(z={})),function(e){e.Text=1,e.Method=2,e.Function=3,e.Constructor=4,e.Field=5,e.Variable=6,e.Class=7,e.Interface=8,e.Module=9,e.Property=10,e.Unit=11,e.Value=12,e.Enum=13,e.Keyword=14,e.Snippet=15,e.Color=16,e.File=17,e.Reference=18,e.Folder=19,e.EnumMember=20,e.Constant=21,e.Struct=22,e.Event=23,e.Operator=24,e.TypeParameter=25}(q||(q={})),function(e){e.PlainText=1,e.Snippet=2}(X||(X={})),function(e){e.Deprecated=1}(B||(B={})),function(e){function t(e,t,n){return{newText:e,insert:t,replace:n}}function n(e){var t=e;return t&&ke.string(t.newText)&&p.is(t.insert)&&p.is(t.replace)}e.create=t,e.is=n}($||($={})),function(e){e.asIs=1,e.adjustIndentation=2}(Q||(Q={})),function(e){function t(e){return{label:e}}e.create=t}(G||(G={})),function(e){function t(e,t){return{items:e||[],isIncomplete:!!t}}e.create=t}(J||(J={})),function(e){function t(e){return e.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}function n(e){var t=e;return ke.string(t)||ke.objectLiteral(t)&&ke.string(t.language)&&ke.string(t.value)}e.fromPlainText=t,e.is=n}(Y||(Y={})),function(e){function t(e){var t=e;return!!t&&ke.objectLiteral(t)&&(z.is(t.contents)||Y.is(t.contents)||ke.typedArray(t.contents,Y.is))&&(void 0===e.range||p.is(e.range))}e.is=t}(ee||(ee={})),function(e){function t(e,t){return t?{label:e,documentation:t}:{label:e}}e.create=t}(te||(te={})),function(e){function t(e,t){for(var n=[],r=2;r<arguments.length;r++)n[r-2]=arguments[r];var i={label:e};return ke.defined(t)&&(i.documentation=t),ke.defined(n)?i.parameters=n:i.parameters=[],i}e.create=t}(ne||(ne={})),function(e){e.Text=1,e.Read=2,e.Write=3}(re||(re={})),function(e){function t(e,t){var n={range:e};return ke.number(t)&&(n.kind=t),n}e.create=t}(ie||(ie={})),function(e){e.File=1,e.Module=2,e.Namespace=3,e.Package=4,e.Class=5,e.Method=6,e.Property=7,e.Field=8,e.Constructor=9,e.Enum=10,e.Interface=11,e.Function=12,e.Variable=13,e.Constant=14,e.String=15,e.Number=16,e.Boolean=17,e.Array=18,e.Object=19,e.Key=20,e.Null=21,e.EnumMember=22,e.Struct=23,e.Event=24,e.Operator=25,e.TypeParameter=26}(oe||(oe={})),function(e){e.Deprecated=1}(ae||(ae={})),function(e){function t(e,t,n,r,i){var o={name:e,kind:t,location:{uri:r,range:n}};return i&&(o.containerName=i),o}e.create=t}(se||(se={})),function(e){function t(e,t,n,r,i,o){var a={name:e,detail:t,kind:n,range:r,selectionRange:i};return void 0!==o&&(a.children=o),a}function n(e){var t=e;return t&&ke.string(t.name)&&ke.number(t.kind)&&p.is(t.range)&&p.is(t.selectionRange)&&(void 0===t.detail||ke.string(t.detail))&&(void 0===t.deprecated||ke.boolean(t.deprecated))&&(void 0===t.children||Array.isArray(t.children))&&(void 0===t.tags||Array.isArray(t.tags))}e.create=t,e.is=n}(ue||(ue={})),function(e){e.Empty="",e.QuickFix="quickfix",e.Refactor="refactor",e.RefactorExtract="refactor.extract",e.RefactorInline="refactor.inline",e.RefactorRewrite="refactor.rewrite",e.Source="source",e.SourceOrganizeImports="source.organizeImports",e.SourceFixAll="source.fixAll"}(ce||(ce={})),function(e){function t(e,t){var n={diagnostics:e};return void 0!==t&&null!==t&&(n.only=t),n}function n(e){var t=e;return ke.defined(t)&&ke.typedArray(t.diagnostics,I.is)&&(void 0===t.only||ke.typedArray(t.only,ke.string))}e.create=t,e.is=n}(de||(de={})),function(e){function t(e,t,n){var r={title:e},i=!0;return"string"===typeof t?(i=!1,r.kind=t):S.is(t)?r.command=t:r.edit=t,i&&void 0!==n&&(r.kind=n),r}function n(e){var t=e;return t&&ke.string(t.title)&&(void 0===t.diagnostics||ke.typedArray(t.diagnostics,I.is))&&(void 0===t.kind||ke.string(t.kind))&&(void 0!==t.edit||void 0!==t.command)&&(void 0===t.command||S.is(t.command))&&(void 0===t.isPreferred||ke.boolean(t.isPreferred))&&(void 0===t.edit||O.is(t.edit))}e.create=t,e.is=n}(ge||(ge={})),function(e){function t(e,t){var n={range:e};return ke.defined(t)&&(n.data=t),n}function n(e){var t=e;return ke.defined(t)&&p.is(t.range)&&(ke.undefined(t.command)||S.is(t.command))}e.create=t,e.is=n}(le||(le={})),function(e){function t(e,t){return{tabSize:e,insertSpaces:t}}function n(e){var t=e;return ke.defined(t)&&ke.uinteger(t.tabSize)&&ke.boolean(t.insertSpaces)}e.create=t,e.is=n}(fe||(fe={})),function(e){function t(e,t,n){return{range:e,target:t,data:n}}function n(e){var t=e;return ke.defined(t)&&p.is(t.range)&&(ke.undefined(t.target)||ke.string(t.target))}e.create=t,e.is=n}(he||(he={})),function(e){function t(e,t){return{range:e,parent:t}}function n(t){var n=t;return void 0!==n&&p.is(n.range)&&(void 0===n.parent||e.is(n.parent))}e.create=t,e.is=n}(pe||(pe={})),function(e){function t(e,t,n,r){return new _e(e,t,n,r)}function n(e){var t=e;return!!(ke.defined(t)&&ke.string(t.uri)&&(ke.undefined(t.languageId)||ke.string(t.languageId))&&ke.uinteger(t.lineCount)&&ke.func(t.getText)&&ke.func(t.positionAt)&&ke.func(t.offsetAt))}function r(e,t){for(var n=e.getText(),r=i(t,(function(e,t){var n=e.range.start.line-t.range.start.line;return 0===n?e.range.start.character-t.range.start.character:n})),o=n.length,a=r.length-1;a>=0;a--){var s=r[a],u=e.offsetAt(s.range.start),c=e.offsetAt(s.range.end);if(!(c<=o))throw new Error("Overlapping edit");n=n.substring(0,u)+s.newText+n.substring(c,n.length),o=u}return n}function i(e,t){if(e.length<=1)return e;var n=e.length/2|0,r=e.slice(0,n),o=e.slice(n);i(r,t),i(o,t);var a=0,s=0,u=0;while(a<r.length&&s<o.length){var c=t(r[a],o[s]);e[u++]=c<=0?r[a++]:o[s++]}while(a<r.length)e[u++]=r[a++];while(s<o.length)e[u++]=o[s++];return e}e.create=t,e.is=n,e.applyEdits=r}(me||(me={}));var ke,_e=function(){function e(e,t,n,r){this._uri=e,this._languageId=t,this._version=n,this._content=r,this._lineOffsets=void 0}return Object.defineProperty(e.prototype,"uri",{get:function(){return this._uri},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"languageId",{get:function(){return this._languageId},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"version",{get:function(){return this._version},enumerable:!1,configurable:!0}),e.prototype.getText=function(e){if(e){var t=this.offsetAt(e.start),n=this.offsetAt(e.end);return this._content.substring(t,n)}return this._content},e.prototype.update=function(e,t){this._content=e.text,this._version=t,this._lineOffsets=void 0},e.prototype.getLineOffsets=function(){if(void 0===this._lineOffsets){for(var e=[],t=this._content,n=!0,r=0;r<t.length;r++){n&&(e.push(r),n=!1);var i=t.charAt(r);n="\r"===i||"\n"===i,"\r"===i&&r+1<t.length&&"\n"===t.charAt(r+1)&&r++}n&&t.length>0&&e.push(t.length),this._lineOffsets=e}return this._lineOffsets},e.prototype.positionAt=function(e){e=Math.max(Math.min(e,this._content.length),0);var t=this.getLineOffsets(),n=0,r=t.length;if(0===r)return h.create(0,e);while(n<r){var i=Math.floor((n+r)/2);t[i]>e?r=i:n=i+1}var o=n-1;return h.create(o,e-t[o])},e.prototype.offsetAt=function(e){var t=this.getLineOffsets();if(e.line>=t.length)return this._content.length;if(e.line<0)return 0;var n=t[e.line],r=e.line+1<t.length?t[e.line+1]:this._content.length;return Math.max(Math.min(n+e.character,r),n)},Object.defineProperty(e.prototype,"lineCount",{get:function(){return this.getLineOffsets().length},enumerable:!1,configurable:!0}),e}();(function(e){var t=Object.prototype.toString;function n(e){return"undefined"!==typeof e}function r(e){return"undefined"===typeof e}function i(e){return!0===e||!1===e}function o(e){return"[object String]"===t.call(e)}function a(e){return"[object Number]"===t.call(e)}function s(e,n,r){return"[object Number]"===t.call(e)&&n<=e&&e<=r}function u(e){return"[object Number]"===t.call(e)&&-2147483648<=e&&e<=2147483647}function c(e){return"[object Number]"===t.call(e)&&0<=e&&e<=2147483647}function d(e){return"[object Function]"===t.call(e)}function g(e){return null!==e&&"object"===typeof e}function l(e,t){return Array.isArray(e)&&e.every(t)}e.defined=n,e.undefined=r,e.boolean=i,e.string=o,e.number=a,e.numberRange=s,e.integer=u,e.uinteger=c,e.func=d,e.objectLiteral=g,e.typedArray=l})(ke||(ke={}));var be=class{constructor(e,t,n){(0,r.Z)(this,"_disposables",[]),(0,r.Z)(this,"_listener",Object.create(null)),this._languageId=e,this._worker=t;const i=e=>{let t,n=e.getLanguageId();n===this._languageId&&(this._listener[e.uri.toString()]=e.onDidChangeContent((()=>{window.clearTimeout(t),t=window.setTimeout((()=>this._doValidate(e.uri,n)),500)})),this._doValidate(e.uri,n))},o=e=>{g.editor.setModelMarkers(e,this._languageId,[]);let t=e.uri.toString(),n=this._listener[t];n&&(n.dispose(),delete this._listener[t])};this._disposables.push(g.editor.onDidCreateModel(i)),this._disposables.push(g.editor.onWillDisposeModel(o)),this._disposables.push(g.editor.onDidChangeModelLanguage((e=>{o(e.model),i(e.model)}))),this._disposables.push(n((e=>{g.editor.getModels().forEach((e=>{e.getLanguageId()===this._languageId&&(o(e),i(e))}))}))),this._disposables.push({dispose:()=>{g.editor.getModels().forEach(o);for(let e in this._listener)this._listener[e].dispose()}}),g.editor.getModels().forEach(i)}dispose(){this._disposables.forEach((e=>e&&e.dispose())),this._disposables.length=0}_doValidate(e,t){this._worker(e).then((t=>t.doValidation(e.toString()))).then((n=>{const r=n.map((t=>ye(e,t)));let i=g.editor.getModel(e);i&&i.getLanguageId()===t&&g.editor.setModelMarkers(i,t,r)})).then(void 0,(e=>{console.error(e)}))}};function Ce(e){switch(e){case E.Error:return g.MarkerSeverity.Error;case E.Warning:return g.MarkerSeverity.Warning;case E.Information:return g.MarkerSeverity.Info;case E.Hint:return g.MarkerSeverity.Hint;default:return g.MarkerSeverity.Info}}function ye(e,t){let n="number"===typeof t.code?String(t.code):t.code;return{severity:Ce(t.severity),startLineNumber:t.range.start.line+1,startColumn:t.range.start.character+1,endLineNumber:t.range.end.line+1,endColumn:t.range.end.character+1,message:t.message,code:n,source:t.source}}var Ee=class{constructor(e,t){this._worker=e,this._triggerCharacters=t}get triggerCharacters(){return this._triggerCharacters}provideCompletionItems(e,t,n,r){const i=e.uri;return this._worker(i).then((e=>e.doComplete(i.toString(),Ae(t)))).then((n=>{if(!n)return;const r=e.getWordUntilPosition(t),i=new g.Range(t.lineNumber,r.startColumn,t.lineNumber,r.endColumn),o=n.items.map((e=>{const t={label:e.label,insertText:e.insertText||e.label,sortText:e.sortText,filterText:e.filterText,documentation:e.documentation,detail:e.detail,command:De(e.command),range:i,kind:Te(e.kind)};return e.textEdit&&(Se(e.textEdit)?t.range={insert:Ie(e.textEdit.insert),replace:Ie(e.textEdit.replace)}:t.range=Ie(e.textEdit.range),t.insertText=e.textEdit.newText),e.additionalTextEdits&&(t.additionalTextEdits=e.additionalTextEdits.map(Re)),e.insertTextFormat===X.Snippet&&(t.insertTextRules=g.languages.CompletionItemInsertTextRule.InsertAsSnippet),t}));return{isIncomplete:n.isIncomplete,suggestions:o}}))}};function Ae(e){if(e)return{character:e.column-1,line:e.lineNumber-1}}function xe(e){if(e)return{start:{line:e.startLineNumber-1,character:e.startColumn-1},end:{line:e.endLineNumber-1,character:e.endColumn-1}}}function Ie(e){if(e)return new g.Range(e.start.line+1,e.start.character+1,e.end.line+1,e.end.character+1)}function Se(e){return"undefined"!==typeof e.insert&&"undefined"!==typeof e.replace}function Te(e){const t=g.languages.CompletionItemKind;switch(e){case q.Text:return t.Text;case q.Method:return t.Method;case q.Function:return t.Function;case q.Constructor:return t.Constructor;case q.Field:return t.Field;case q.Variable:return t.Variable;case q.Class:return t.Class;case q.Interface:return t.Interface;case q.Module:return t.Module;case q.Property:return t.Property;case q.Unit:return t.Unit;case q.Value:return t.Value;case q.Enum:return t.Enum;case q.Keyword:return t.Keyword;case q.Snippet:return t.Snippet;case q.Color:return t.Color;case q.File:return t.File;case q.Reference:return t.Reference}return t.Property}function Re(e){if(e)return{range:Ie(e.range),text:e.newText}}function De(e){return e&&"editor.action.triggerSuggest"===e.command?{id:e.command,title:e.title,arguments:e.arguments}:void 0}var Pe=class{constructor(e){this._worker=e}provideHover(e,t,n){let r=e.uri;return this._worker(r).then((e=>e.doHover(r.toString(),Ae(t)))).then((e=>{if(e)return{range:Ie(e.range),contents:Le(e.contents)}}))}};function Me(e){return e&&"object"===typeof e&&"string"===typeof e.kind}function je(e){return"string"===typeof e?{value:e}:Me(e)?"plaintext"===e.kind?{value:e.value.replace(/[\\`*_{}[\]()#+\-.!]/g,"\\$&")}:{value:e.value}:{value:"```"+e.language+"\n"+e.value+"\n```\n"}}function Le(e){if(e)return Array.isArray(e)?e.map(je):[je(e)]}var Fe=class{constructor(e){this._worker=e}provideDocumentHighlights(e,t,n){const r=e.uri;return this._worker(r).then((e=>e.findDocumentHighlights(r.toString(),Ae(t)))).then((e=>{if(e)return e.map((e=>({range:Ie(e.range),kind:Oe(e.kind)})))}))}};function Oe(e){switch(e){case re.Read:return g.languages.DocumentHighlightKind.Read;case re.Write:return g.languages.DocumentHighlightKind.Write;case re.Text:return g.languages.DocumentHighlightKind.Text}return g.languages.DocumentHighlightKind.Text}var Ne=class{constructor(e){this._worker=e}provideDefinition(e,t,n){const r=e.uri;return this._worker(r).then((e=>e.findDefinition(r.toString(),Ae(t)))).then((e=>{if(e)return[We(e)]}))}};function We(e){return{uri:g.Uri.parse(e.uri),range:Ie(e.range)}}var Ue=class{constructor(e){this._worker=e}provideReferences(e,t,n,r){const i=e.uri;return this._worker(i).then((e=>e.findReferences(i.toString(),Ae(t)))).then((e=>{if(e)return e.map(We)}))}},Ve=class{constructor(e){this._worker=e}provideRenameEdits(e,t,n,r){const i=e.uri;return this._worker(i).then((e=>e.doRename(i.toString(),Ae(t),n))).then((e=>He(e)))}};function He(e){if(!e||!e.changes)return;let t=[];for(let n in e.changes){const r=g.Uri.parse(n);for(let i of e.changes[n])t.push({resource:r,versionId:void 0,textEdit:{range:Ie(i.range),text:i.newText}})}return{edits:t}}var Ke=class{constructor(e){this._worker=e}provideDocumentSymbols(e,t){const n=e.uri;return this._worker(n).then((e=>e.findDocumentSymbols(n.toString()))).then((e=>{if(e)return e.map((e=>({name:e.name,detail:"",containerName:e.containerName,kind:Ze(e.kind),range:Ie(e.location.range),selectionRange:Ie(e.location.range),tags:[]})))}))}};function Ze(e){let t=g.languages.SymbolKind;switch(e){case oe.File:return t.Array;case oe.Module:return t.Module;case oe.Namespace:return t.Namespace;case oe.Package:return t.Package;case oe.Class:return t.Class;case oe.Method:return t.Method;case oe.Property:return t.Property;case oe.Field:return t.Field;case oe.Constructor:return t.Constructor;case oe.Enum:return t.Enum;case oe.Interface:return t.Interface;case oe.Function:return t.Function;case oe.Variable:return t.Variable;case oe.Constant:return t.Constant;case oe.String:return t.String;case oe.Number:return t.Number;case oe.Boolean:return t.Boolean;case oe.Array:return t.Array}return t.Function}var ze=class{constructor(e){this._worker=e}provideLinks(e,t){const n=e.uri;return this._worker(n).then((e=>e.findDocumentLinks(n.toString()))).then((e=>{if(e)return{links:e.map((e=>({range:Ie(e.range),url:e.target})))}}))}},qe=class{constructor(e){this._worker=e}provideDocumentFormattingEdits(e,t,n){const r=e.uri;return this._worker(r).then((e=>e.format(r.toString(),null,Be(t)).then((e=>{if(e&&0!==e.length)return e.map(Re)}))))}},Xe=class{constructor(e){(0,r.Z)(this,"canFormatMultipleRanges",!1),this._worker=e}provideDocumentRangeFormattingEdits(e,t,n,r){const i=e.uri;return this._worker(i).then((e=>e.format(i.toString(),xe(t),Be(n)).then((e=>{if(e&&0!==e.length)return e.map(Re)}))))}};function Be(e){return{tabSize:e.tabSize,insertSpaces:e.insertSpaces}}var $e=class{constructor(e){this._worker=e}provideDocumentColors(e,t){const n=e.uri;return this._worker(n).then((e=>e.findDocumentColors(n.toString()))).then((e=>{if(e)return e.map((e=>({color:e.color,range:Ie(e.range)})))}))}provideColorPresentations(e,t,n){const r=e.uri;return this._worker(r).then((e=>e.getColorPresentations(r.toString(),t.color,xe(t.range)))).then((e=>{if(e)return e.map((e=>{let t={label:e.label};return e.textEdit&&(t.textEdit=Re(e.textEdit)),e.additionalTextEdits&&(t.additionalTextEdits=e.additionalTextEdits.map(Re)),t}))}))}},Qe=class{constructor(e){this._worker=e}provideFoldingRanges(e,t,n){const r=e.uri;return this._worker(r).then((e=>e.getFoldingRanges(r.toString(),t))).then((e=>{if(e)return e.map((e=>{const t={start:e.startLine+1,end:e.endLine+1};return"undefined"!==typeof e.kind&&(t.kind=Ge(e.kind)),t}))}))}};function Ge(e){switch(e){case b.Comment:return g.languages.FoldingRangeKind.Comment;case b.Imports:return g.languages.FoldingRangeKind.Imports;case b.Region:return g.languages.FoldingRangeKind.Region}}var Je,Ye=class{constructor(e){this._worker=e}provideSelectionRanges(e,t,n){const r=e.uri;return this._worker(r).then((e=>e.getSelectionRanges(r.toString(),t.map(Ae)))).then((e=>{if(e)return e.map((e=>{const t=[];while(e)t.push({range:Ie(e.range)}),e=e.parent;return t}))}))}};function et(e,t){void 0===t&&(t=!1);var n=e.length,r=0,i="",o=0,a=16,s=0,u=0,c=0,d=0,g=0;function l(t,n){var i=0,o=0;while(i<t||!n){var a=e.charCodeAt(r);if(a>=48&&a<=57)o=16*o+a-48;else if(a>=65&&a<=70)o=16*o+a-65+10;else{if(!(a>=97&&a<=102))break;o=16*o+a-97+10}r++,i++}return i<t&&(o=-1),o}function f(e){r=e,i="",o=0,a=16,g=0}function h(){var t=r;if(48===e.charCodeAt(r))r++;else{r++;while(r<e.length&&rt(e.charCodeAt(r)))r++}if(r<e.length&&46===e.charCodeAt(r)){if(r++,!(r<e.length&&rt(e.charCodeAt(r))))return g=3,e.substring(t,r);r++;while(r<e.length&&rt(e.charCodeAt(r)))r++}var n=r;if(r<e.length&&(69===e.charCodeAt(r)||101===e.charCodeAt(r)))if(r++,(r<e.length&&43===e.charCodeAt(r)||45===e.charCodeAt(r))&&r++,r<e.length&&rt(e.charCodeAt(r))){r++;while(r<e.length&&rt(e.charCodeAt(r)))r++;n=r}else g=3;return e.substring(t,n)}function p(){var t="",i=r;while(1){if(r>=n){t+=e.substring(i,r),g=2;break}var o=e.charCodeAt(r);if(34===o){t+=e.substring(i,r),r++;break}if(92!==o){if(o>=0&&o<=31){if(nt(o)){t+=e.substring(i,r),g=2;break}g=6}r++}else{if(t+=e.substring(i,r),r++,r>=n){g=2;break}var a=e.charCodeAt(r++);switch(a){case 34:t+='"';break;case 92:t+="\\";break;case 47:t+="/";break;case 98:t+="\b";break;case 102:t+="\f";break;case 110:t+="\n";break;case 114:t+="\r";break;case 116:t+="\t";break;case 117:var s=l(4,!0);s>=0?t+=String.fromCharCode(s):g=4;break;default:g=5}i=r}}return t}function m(){if(i="",g=0,o=r,u=s,d=c,r>=n)return o=n,a=17;var t=e.charCodeAt(r);if(tt(t)){do{r++,i+=String.fromCharCode(t),t=e.charCodeAt(r)}while(tt(t));return a=15}if(nt(t))return r++,i+=String.fromCharCode(t),13===t&&10===e.charCodeAt(r)&&(r++,i+="\n"),s++,c=r,a=14;switch(t){case 123:return r++,a=1;case 125:return r++,a=2;case 91:return r++,a=3;case 93:return r++,a=4;case 58:return r++,a=6;case 44:return r++,a=5;case 34:return r++,i=p(),a=10;case 47:var l=r-1;if(47===e.charCodeAt(r+1)){r+=2;while(r<n){if(nt(e.charCodeAt(r)))break;r++}return i=e.substring(l,r),a=12}if(42===e.charCodeAt(r+1)){r+=2;var f=n-1,m=!1;while(r<f){var w=e.charCodeAt(r);if(42===w&&47===e.charCodeAt(r+1)){r+=2,m=!0;break}r++,nt(w)&&(13===w&&10===e.charCodeAt(r)&&r++,s++,c=r)}return m||(r++,g=1),i=e.substring(l,r),a=13}return i+=String.fromCharCode(t),r++,a=16;case 45:if(i+=String.fromCharCode(t),r++,r===n||!rt(e.charCodeAt(r)))return a=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return i+=h(),a=11;default:while(r<n&&v(t))r++,t=e.charCodeAt(r);if(o!==r){switch(i=e.substring(o,r),i){case"true":return a=8;case"false":return a=9;case"null":return a=7}return a=16}return i+=String.fromCharCode(t),r++,a=16}}function v(e){if(tt(e)||nt(e))return!1;switch(e){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return!1}return!0}function w(){var e;do{e=m()}while(e>=12&&e<=15);return e}return{setPosition:f,getPosition:function(){return r},scan:t?w:m,getToken:function(){return a},getTokenValue:function(){return i},getTokenOffset:function(){return o},getTokenLength:function(){return r-o},getTokenStartLine:function(){return u},getTokenStartCharacter:function(){return o-d},getTokenError:function(){return g}}}function tt(e){return 32===e||9===e||11===e||12===e||160===e||5760===e||e>=8192&&e<=8203||8239===e||8287===e||12288===e||65279===e}function nt(e){return 10===e||13===e||8232===e||8233===e}function rt(e){return e>=48&&e<=57}(function(e){e.DEFAULT={allowTrailingComma:!1}})(Je||(Je={}));var it=et;function ot(e){return{getInitialState:()=>new wt(null,null,!1,null),tokenize:(t,n)=>kt(e,t,n)}}var at="delimiter.bracket.json",st="delimiter.array.json",ut="delimiter.colon.json",ct="delimiter.comma.json",dt="keyword.json",gt="keyword.json",lt="string.value.json",ft="number.json",ht="string.key.json",pt="comment.block.json",mt="comment.line.json",vt=class{constructor(e,t){this.parent=e,this.type=t}static pop(e){return e?e.parent:null}static push(e,t){return new vt(e,t)}static equals(e,t){if(!e&&!t)return!0;if(!e||!t)return!1;while(e&&t){if(e===t)return!0;if(e.type!==t.type)return!1;e=e.parent,t=t.parent}return!0}},wt=class e{constructor(e,t,n,i){(0,r.Z)(this,"_state",void 0),(0,r.Z)(this,"scanError",void 0),(0,r.Z)(this,"lastWasColon",void 0),(0,r.Z)(this,"parents",void 0),this._state=e,this.scanError=t,this.lastWasColon=n,this.parents=i}clone(){return new e(this._state,this.scanError,this.lastWasColon,this.parents)}equals(t){return t===this||!!(t&&t instanceof e)&&(this.scanError===t.scanError&&this.lastWasColon===t.lastWasColon&&vt.equals(this.parents,t.parents))}getStateData(){return this._state}setStateData(e){this._state=e}};function kt(e,t,n,r=0){let i=0,o=!1;switch(n.scanError){case 2:t='"'+t,i=1;break;case 1:t="/*"+t,i=2;break}const a=it(t);let s=n.lastWasColon,u=n.parents;const c={tokens:[],endState:n.clone()};while(1){let d=r+a.getPosition(),g="";const l=a.scan();if(17===l)break;if(d===r+a.getPosition())throw new Error("Scanner did not advance, next 3 characters are: "+t.substr(a.getPosition(),3));switch(o&&(d-=i),o=i>0,l){case 1:u=vt.push(u,0),g=at,s=!1;break;case 2:u=vt.pop(u),g=at,s=!1;break;case 3:u=vt.push(u,1),g=st,s=!1;break;case 4:u=vt.pop(u),g=st,s=!1;break;case 6:g=ut,s=!0;break;case 5:g=ct,s=!1;break;case 8:case 9:g=dt,s=!1;break;case 7:g=gt,s=!1;break;case 10:const e=u?u.type:0,t=1===e;g=s||t?lt:ht,s=!1;break;case 11:g=ft,s=!1;break}if(e)switch(l){case 12:g=mt;break;case 13:g=pt;break}c.endState=new wt(n.getStateData(),a.getTokenError(),s,u),c.tokens.push({startIndex:d,scopes:g})}return c}var _t=class extends be{constructor(e,t,n){super(e,t,n.onDidChange),this._disposables.push(g.editor.onWillDisposeModel((e=>{this._resetSchema(e.uri)}))),this._disposables.push(g.editor.onDidChangeModelLanguage((e=>{this._resetSchema(e.model.uri)})))}_resetSchema(e){this._worker().then((t=>{t.resetSchema(e.toString())}))}};function bt(e){const t=[],n=[],r=new W(e);t.push(r);const i=(...e)=>r.getLanguageServiceWorker(...e);function o(){const{languageId:t,modeConfiguration:r}=e;yt(n),r.documentFormattingEdits&&n.push(g.languages.registerDocumentFormattingEditProvider(t,new qe(i))),r.documentRangeFormattingEdits&&n.push(g.languages.registerDocumentRangeFormattingEditProvider(t,new Xe(i))),r.completionItems&&n.push(g.languages.registerCompletionItemProvider(t,new Ee(i,[" ",":",'"']))),r.hovers&&n.push(g.languages.registerHoverProvider(t,new Pe(i))),r.documentSymbols&&n.push(g.languages.registerDocumentSymbolProvider(t,new Ke(i))),r.tokens&&n.push(g.languages.setTokensProvider(t,ot(!0))),r.colors&&n.push(g.languages.registerColorProvider(t,new $e(i))),r.foldingRanges&&n.push(g.languages.registerFoldingRangeProvider(t,new Qe(i))),r.diagnostics&&n.push(new _t(t,i,e)),r.selectionRanges&&n.push(g.languages.registerSelectionRangeProvider(t,new Ye(i)))}o(),t.push(g.languages.setLanguageConfiguration(e.languageId,Et));let a=e.modeConfiguration;return e.onDidChange((e=>{e.modeConfiguration!==a&&(a=e.modeConfiguration,o())})),t.push(Ct(n)),Ct(t)}function Ct(e){return{dispose:()=>yt(e)}}function yt(e){while(e.length)e.pop().dispose()}var Et={wordPattern:/(-?\d*\.\d\w*)|([^\[\{\]\}\:\"\,\s]+)/g,comments:{lineComment:"//",blockComment:["/*","*/"]},brackets:[["{","}"],["[","]"]],autoClosingPairs:[{open:"{",close:"}",notIn:["string"]},{open:"[",close:"]",notIn:["string"]},{open:'"',close:'"',notIn:["string"]}]}}}]);