<?php //Extension xmlreader
//@php_DOMXML.xml#XMLReader
 class XMLReader   {

// Constants
	 const NONE=0;
	 const ELEMENT=1;
	 const ATTRIBUTE=2;
	 const TEXT=3;
	 const CDATA=4;
	 const ENTITY_REF=5;
	 const ENTITY=6;
	 const PI=7;
	 const COMMENT=8;
	 const DOC=9;
	 const DOC_TYPE=10;
	 const DOC_FRAGMENT=11;
	 const NOTATION=12;
	 const WHITESPACE=13;
	 const SIGNIFICANT_WHITESPACE=14;
	 const END_ELEMENT=15;
	 const END_ENTITY=16;
	 const XML_DECLARATION=17;
	 const LOADDTD=1;
	 const DEFAULTATTRS=2;
	 const VALIDATE=3;
	 const SUBST_ENTITIES=4;

// Properties
	public   $attributeCount ;
	public   $baseURI ;
	public   $depth ;
	public   $hasAttributes ;
	public $hasValue ;
	public $isDefault ;
	public $isEmptyElement ;
	public $localName ;
	public $name ;
	public $namespaceURI ;
	public $nodeType ;
	public $prefix ;
	public $value ;
	public $xmlLang ;
// Methods
 //@php_DOMXML.xml#XMLReader::close
	public function close(){ }
 //@php_DOMXML.xml#XMLReader::getAttribute
	public function getAttribute( $name ){ }
 //@php_DOMXML.xml#XMLReader::getAttributeNo
	public function getAttributeNo( $index ){ }
 //@php_DOMXML.xml#XMLReader::getAttributeNs
	public function getAttributeNs( $name , $namespaceURI ){ }
 //@php_DOMXML.xml#XMLReader::getParserProperty
	public function getParserProperty( $property ){ }
 //@php_DOMXML.xml#XMLReader::isValid
	public function isValid(){ }
 //@php_DOMXML.xml#XMLReader::lookupNamespace
	public function lookupNamespace( $prefix ){ }
 //@php_DOMXML.xml#XMLReader::moveToAttributeNo
	public function moveToAttributeNo( $index ){ }
 //@php_DOMXML.xml#XMLReader::moveToAttribute
	public function moveToAttribute( $name ){ }
 //@php_DOMXML.xml#XMLReader::moveToAttributeNs
	public function moveToAttributeNs( $name , $namespaceURI ){ }
 //@php_DOMXML.xml#XMLReader::moveToElement
	public function moveToElement(){ }
 //@php_DOMXML.xml#XMLReader::moveToFirstAttribute
	public function moveToFirstAttribute(){ }
 //@php_DOMXML.xml#XMLReader::moveToNextAttribute
	public function moveToNextAttribute(){ }
 //@php_DOMXML.xml#XMLReader::open
	public function open( $URI , $encoding , $options ){ }
 //@php_DOMXML.xml#XMLReader::read
	public function read(){ }
 //@php_DOMXML.xml#XMLReader::next
	public function next( $localname ){ }
 //@php_DOMXML.xml#XMLReader::readInnerXML
	public function readInnerXml(){ }
 //@php_DOMXML.xml#XMLReader::readOuterXML
	public function readOuterXml(){ }
 //@php_DOMXML.xml#XMLReader::readString
	public function readString(){ }
 //@php_DOMXML.xml#XMLReader::setSchema
	public function setSchema( $filename ){ }
 //@php_DOMXML.xml#XMLReader::setParserProperty
	public function setParserProperty( $property , $value ){ }
 //@php_DOMXML.xml#XMLReader::setRelaxNGSchema
	public function setRelaxNGSchema( $filename ){ }
 //@php_DOMXML.xml#XMLReader::setRelaxNGSchemaSource
	public function setRelaxNGSchemaSource( $source ){ }
 //@php_DOMXML.xml#XMLReader::XML
	public function XML( $source , $encoding , $options ){ }
 //@php_DOMXML.xml#XMLReader::expand
	public function expand(){ return new DOMNode(); }

}

////////////////////////////////////////////////////////////////////////////////////


/////////////////// ********** FUNCTIONS (0 total functions) ************ ///////////////////////////////


/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension xmlwriter
// WARNING: class XMLWriter is undocummented class;

 class XMLWriter  {
        public function openUri($uri){}
        public function openMemory(){}
        public function setIndent($indent){}
        public function setIndentString($indentString){}
        public function startComment(){}
        public function endComment(){}
        public function startAttribute($name){}
        public function endAttribute(){}
        public function writeAttribute($name, $value){}
        public function startAttributeNs($prefix , $name , $uri ){}
        public function writeAttributeNs( $prefix , $name , $uri , $content ){}
        public function startElement($name){}
        public function endElement(){}
        public function fullEndElement(){}
        public function startElementNs( $prefix ,  $name ,  $uri){}
        public function writeElement($name, $content ){}
        public function writeElementNs($prefix , $name , $uri , $content ){}
        public function startPi($target){}
        public function endPi(){}
        public function writePi(string $target , string $content){}
        public function startCdata(){}
        public function endCdata(){}
        public function writeCdata($content){}
        public function text($content){}
        public function writeRaw($content){}
        public function startDocument( $version , $encoding , $standalone){}
        public function endDocument(){}
        public function writeComment( $content){}
        public function startDtd($qualifiedName, $publicId , $systemId){}
        public function endDtd(){}
        public function writeDtd(){}
        public function startDtdElement($qualifiedName){}
        public function endDtdElement(){}
        public function writeDtdElement($name , $content){}
        public function startDtdAttlist($name){}
        public function endDtdAttlist(){}
        public function writeDtdAttlist($name,$content){}
        public function startDtdEntity($name , $isparam){}
        public function endDtdEntity(){}
        public function writeDtdEntity($name , $content , $pe , $pubid , $sysid , $ndataid ){}
        public function outputMemory($flush){}
        public function flush($empty){}
}
////////////////////////////////////////////////////////////////////////////////////


/////////////////// ********** FUNCTIONS (42 total functions) ************ ///////////////////////////////

// 1: function xmlwriter_open_uri(); // prototype:xmlwriter_open_uri ( string $uri )
// 2: function xmlwriter_open_memory(); // prototype:xmlwriter_open_memory ( void )
// 3: function xmlwriter_set_indent(); // prototype:xmlwriter_set_indent ( resource $xmlwriter , bool $indent )
// 4: function xmlwriter_set_indent_string(); // prototype:xmlwriter_set_indent_string ( resource $xmlwriter , string $indentString )
// 5: function xmlwriter_start_comment(); // prototype:xmlwriter_start_comment ( resource $xmlwriter )
// 6: function xmlwriter_end_comment(); // prototype:xmlwriter_end_comment ( resource $xmlwriter )
// 7: function xmlwriter_start_attribute(); // prototype:xmlwriter_start_attribute ( resource $xmlwriter , string $name )
// 8: function xmlwriter_end_attribute(); // prototype:xmlwriter_end_attribute ( resource $xmlwriter )
// 9: function xmlwriter_write_attribute(); // prototype:xmlwriter_write_attribute ( resource $xmlwriter , string $name , string $value )
// 10: function xmlwriter_start_attribute_ns(); // prototype:xmlwriter_start_attribute_ns ( resource $xmlwriter , string $prefix , string $name , string $uri )
// 11: function xmlwriter_write_attribute_ns(); // prototype:xmlwriter_write_attribute_ns ( resource $xmlwriter , string $prefix , string $name , string $uri , string $content )
// 12: function xmlwriter_start_element(); // prototype:xmlwriter_start_element ( resource $xmlwriter , string $name )
// 13: function xmlwriter_end_element(); // prototype:xmlwriter_end_element ( resource $xmlwriter )
// 14: function xmlwriter_full_end_element(); // prototype:xmlwriter_full_end_element ( resource $xmlwriter )
// 15: function xmlwriter_start_element_ns(); // prototype:xmlwriter_start_element_ns ( resource $xmlwriter , string $prefix , string $name , string $uri )
// 16: function xmlwriter_write_element(); // prototype:xmlwriter_write_element ( resource $xmlwriter , string $name [, string $content ] )
// 17: function xmlwriter_write_element_ns(); // prototype:xmlwriter_write_element_ns ( resource $xmlwriter , string $prefix , string $name , string $uri [, string $content ] )
// 18: function xmlwriter_start_pi(); // prototype:xmlwriter_start_pi ( resource $xmlwriter , string $target )
// 19: function xmlwriter_end_pi(); // prototype:xmlwriter_end_pi ( resource $xmlwriter )
// 20: function xmlwriter_write_pi(); // prototype:xmlwriter_write_pi ( resource $xmlwriter , string $target , string $content )
// 21: function xmlwriter_start_cdata(); // prototype:xmlwriter_start_cdata ( resource $xmlwriter )
// 22: function xmlwriter_end_cdata(); // prototype:xmlwriter_end_cdata ( resource $xmlwriter )
// 23: function xmlwriter_write_cdata(); // prototype:xmlwriter_write_cdata ( resource $xmlwriter , string $content )
// 24: function xmlwriter_text(); // prototype:xmlwriter_text ( resource $xmlwriter , string $content )
// 25: function xmlwriter_write_raw(); // prototype:xmlwriter_write_raw ( resource $xmlwriter , string $content )
// 26: function xmlwriter_start_document(); // prototype:xmlwriter_start_document ( resource $xmlwriter [, string $version [, string $encoding [, string $standalone ]]] )
// 27: function xmlwriter_end_document(); // prototype:xmlwriter_end_document ( resource $xmlwriter )
// 28: function xmlwriter_write_comment(); // prototype:xmlwriter_write_comment ( resource $xmlwriter , string $content )
// 29: function xmlwriter_start_dtd(); // prototype:xmlwriter_start_dtd ( resource $xmlwriter , string $qualifiedName [, string $publicId [, string $systemId ]] )
// 30: function xmlwriter_end_dtd(); // prototype:xmlwriter_end_dtd ( resource $xmlwriter )
// 31: function xmlwriter_write_dtd(); // prototype:xmlwriter_write_dtd ( resource $xmlwriter , string $name [, string $publicId [, string $systemId [, string $subset ]]] )
// 32: function xmlwriter_start_dtd_element(); // prototype:xmlwriter_start_dtd_element ( resource $xmlwriter , string $qualifiedName )
// 33: function xmlwriter_end_dtd_element(); // prototype:xmlwriter_end_dtd_element ( resource $xmlwriter )
// 34: function xmlwriter_write_dtd_element(); // prototype:xmlwriter_write_dtd_element ( resource $xmlwriter , string $name , string $content )
// 35: function xmlwriter_start_dtd_attlist(); // prototype:xmlwriter_start_dtd_attlist ( resource $xmlwriter , string $name )
// 36: function xmlwriter_end_dtd_attlist(); // prototype:xmlwriter_end_dtd_attlist ( resource $xmlwriter )
// 37: function xmlwriter_write_dtd_attlist(); // prototype:xmlwriter_write_dtd_attlist ( resource $xmlwriter , string $name , string $content )
// 38: function xmlwriter_start_dtd_entity(); // prototype:xmlwriter_start_dtd_entity ( resource $xmlwriter , string $name , bool $isparam )
// 39: function xmlwriter_end_dtd_entity(); // prototype:xmlwriter_end_dtd_entity ( resource $xmlwriter )
// 40: function xmlwriter_write_dtd_entity(); // prototype:xmlwriter_write_dtd_entity ( resource $xmlwriter , string $name , string $content , bool $pe , string $pubid , string $sysid , string $ndataid )
// 41: function xmlwriter_output_memory(); // prototype:xmlwriter_output_memory ( resource $xmlwriter [, bool $flush ] )
// 42: function xmlwriter_flush(); // prototype:xmlwriter_flush ( resource $xmlwriter [, bool $empty ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension dom
//@php_DOMXML.xml#DOMException
final class DOMException extends Exception  {

// Constants

// Properties
	protected $message;
	public $code;
	protected $file;
	protected $line;

// Methods

}

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMStringList is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMNameList is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMImplementationList is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMImplementationSource is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMImplementation
 class DOMImplementation   {

// Constants

// Properties

// Methods
// function getFeature() NOT FOUND
 //@php_DOMXML.xml#DOMImplementation::hasFeature
	public function hasFeature($feature , $version){ }
 //@php_DOMXML.xml#DOMImplementation::createDocumentType
	public function createDocumentType( $qualifiedName , $publicId , $systemId ){ return new DOMDocumentType();}
 //@php_DOMXML.xml#DOMImplementation::createDocument
	public function createDocument( $namespaceURI , $qualifiedName , DOMDocumentType $docType ){return new DOMDocument();}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMNode
 class DOMNode   {

// Constants

// Properties
public $nodeName ;
public $nodeValue ;
public $nodeType ;
public $parentNode; 
public $childNodes ;
public $firstChild ;
public $lastChild ;
public $previousSibling ;
public $nextSibling ;
public $attributes ;
public $ownerDocument ;
public $namespaceURI ;
public $prefix ;
public $localName ;
public $baseURI ;
public $textContent ;
// Methods
// pseudo-initializer
private function __builtin_initializer(){
	 $this->parentNode = new DOMNode();
	 $this->firstChild = new DOMNode();
	 $this->lastChild =  new DOMNode();
	 $this->previousSibling = new DOMNode();
	 $this->nextSibling = new DOMNode();
	 $this->childNodes = new DOMNodeList();
	 $this->attributes = new DOMNamedNodeMap();
	 $this->ownerDocument = new DOMDocument();
}
 //@php_DOMXML.xml#DOMNode::insertBefore
	public function insertBefore( DOMNode $newChild , DOMNode  $refChild ){ return new DOMNode();}
 //@php_DOMXML.xml#DOMNode::replaceChild
	public function replaceChild( DOMNode $newChild , DOMNode $oldChild ){return new DOMNode(); }
 //@php_DOMXML.xml#DOMNode::removeChild
	public function removeChild( DOMNode $oldChild ){ return new DOMNode(); }
 //@php_DOMXML.xml#DOMNode::appendChild
	public function appendChild( DOMNode $newChild ){ return new DOMNode(); }
 //@php_DOMXML.xml#DOMNode::hasChildNodes
	public function hasChildNodes(){ }
 //@php_DOMXML.xml#DOMNode::cloneNode
	public function cloneNode( $deep ){return new DOMNode(); }
 //@php_DOMXML.xml#DOMNode::normalize
	public function normalize(){ }
 //@php_DOMXML.xml#DOMNode::isSupported
	public function isSupported( $feature , $version ){ }
 //@php_DOMXML.xml#DOMNode::hasAttributes
	public function hasAttributes(){ }
// function compareDocumentPosition() NOT FOUND
 //@php_DOMXML.xml#DOMNode::isSameNode
	public function isSameNode( DOMNode $other ){ }
 //@php_DOMXML.xml#DOMNode::lookupPrefix
	public function lookupPrefix( $namespaceURI ){ }
 //@php_DOMXML.xml#DOMNode::isDefaultNamespace
	public function isDefaultNamespace( $namespaceURI ){ }
 //@php_DOMXML.xml#DOMNode::lookupNamespaceURI
	public function lookupNamespaceUri( $prefix ){ }
// function isEqualNode() NOT FOUND
// function getFeature() NOT FOUND
// function setUserData() NOT FOUND
// function getUserData() NOT FOUND
// function getNodePath() NOT FOUND
// function C14N() NOT FOUND
// function C14NFile() NOT FOUND

}

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMNameSpaceNode is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMDocumentFragment
 class DOMDocumentFragment extends DOMNode  {

// Constants

// Properties

// Methods
// function __construct() NOT FOUND
 //@php_DOMXML.xml#DOMDocumentFragment::appendXML
	public function appendXML( $data ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMDocument
 class DOMDocument extends DOMNode  {

// Constants

// Properties
public $actualEncoding ;
public $config ;
public $doctype ;
public $documentElement ;
public $documentURI ;
public $encoding ;
public $formatOutput ;
public $implementation ;
public $preserveWhiteSpace = true ;
public $recover ;
public $resolveExternals ;
public $standalone ;
public $strictErrorChecking = true ;
public $substituteEntities ;
public $validateOnParse = false ;
public $version ;
public $xmlEncoding ;
public $xmlStandalone ;
public $xmlVersion ;

// Methods
// pseudo-initializer
private function __builtin_initializer(){
	 $this->doctype = new DOMDocumentType();
	 $this->documentElement = new DOMElement();
	 $this->implementation = new DOMImplementation();
}
 //@php_DOMXML.xml#DOMDocument::createElement
	public function createElement( $tagName , $value ){ return new DOMElement(); }
 //@php_DOMXML.xml#DOMDocument::createDocumentFragment
	public function createDocumentFragment(){ return new DOMDocumentFragment (); }
 //@php_DOMXML.xml#DOMDocument::createTextNode
	public function createTextNode( $data ){ return new DOMText(); }
 //@php_DOMXML.xml#DOMDocument::createComment
	public function createComment( $data ){ return new DOMComment(); }
 //@php_DOMXML.xml#DOMDocument::createCDATASection
	public function createCDATASection( $data ){ /*DOMCDATASection not documented*/ }
 //@php_DOMXML.xml#DOMDocument::createProcessingInstruction
	public function createProcessingInstruction( $target , $data ){ return new DOMProcessingInstruction(); }
 //@php_DOMXML.xml#DOMDocument::createAttribute
	public function createAttribute( $name ){ return new DOMAttr(); }
 //@php_DOMXML.xml#DOMDocument::createEntityReference
	public function createEntityReference( $name ){ return new DOMEntityReference(); }
 //@php_DOMXML.xml#DOMDocument::getElementsByTagName
	public function getElementsByTagName( $tagName ){ return new DOMNodeList(); }
 //@php_DOMXML.xml#DOMDocument::importNode
	public function importNode( DOMNode $importedNode , $deep ){return new DOMNode(); }
 //@php_DOMXML.xml#DOMDocument::createElementNS
	public function createElementNS( $namespaceURI , $qualifiedName , $value ){ return new DOMElement(); }
 //@php_DOMXML.xml#DOMDocument::createAttributeNS
	public function createAttributeNS( $namespaceURI , $qualifiedName ){ return new DOMAttr(); }
 //@php_DOMXML.xml#DOMDocument::getElementsByTagNameNS
	public function getElementsByTagNameNS( $namespaceURI , $localName ){ return new DOMNodeList(); }
 //@php_DOMXML.xml#DOMDocument::getElementById
	public function getElementById( $elementId ){ return new DOMElement(); }
// function adoptNode() NOT FOUND
 //@php_DOMXML.xml#DOMDocument::normalizeDocument
	public function normalizeDocument(){ }
// function renameNode() NOT FOUND
 //@php_DOMXML.xml#DOMDocument::load
	public function load( $source , $options ){ }
 //@php_DOMXML.xml#DOMDocument::save
	public function save( $file ){ }
 //@php_DOMXML.xml#DOMDocument::loadXML
	public function loadXML( $source , $options ){ }
 //@php_DOMXML.xml#DOMDocument::saveXML
	public function saveXML( DOMNode  $node, $options ){ }
 //@php_DOMXML.xml#DOMDocument::__construct
	public function __construct( $version , $encoding ){ }
 //@php_DOMXML.xml#DOMDocument::validate
	public function validate(){ }
 //@php_DOMXML.xml#DOMDocument::xinclude
	public function xinclude( $options ){ }
 //@php_DOMXML.xml#DOMDocument::loadHTML
	public function loadHTML( $source ){ }
 //@php_DOMXML.xml#DOMDocument::loadHTMLFile
	public function loadHTMLFile( $source ){ }
 //@php_DOMXML.xml#DOMDocument::saveHTML
	public function saveHTML(){ }
 //@php_DOMXML.xml#DOMDocument::saveHTMLFile
	public function saveHTMLFile( $file ){ }
 //@php_DOMXML.xml#DOMDocument::schemaValidate
	public function schemaValidate( $filename ){ }
 //@php_DOMXML.xml#DOMDocument::schemaValidateSource
	public function schemaValidateSource( $source ){ }
 //@php_DOMXML.xml#DOMDocument::relaxNGValidate
	public function relaxNGValidate( $filename ){ }
 //@php_DOMXML.xml#DOMDocument::relaxNGValidateSource
	public function relaxNGValidateSource( $source ){ }
 //@php_DOMXML.xml#DOMDocument::registerNodeClass
	public function registerNodeClass( $baseClass , $extendedClass ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMNodeList
 class DOMNodeList   {

// Constants

// Properties
   public $length;
// Methods
 //@php_DOMXML.xml#DOMNodelist::item
	public function item( $index ){ return new DOMNode(); }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMNamedNodeMap
 class DOMNamedNodeMap   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#DOMNamedNodeMap::getNamedItem
	public function getNamedItem( $name ){ return new DOMNode();}
// function setNamedItem() NOT FOUND
// function removeNamedItem() NOT FOUND
 //@php_DOMXML.xml#DOMNamedNodeMap::item
	public function item( $index ){ return new DOMNode();}
 //@php_DOMXML.xml#DOMNamedNodeMap::getNamedItemNS
	public function getNamedItemNS( $namespaceURI , $localName ){return new DOMNode(); }
// function setNamedItemNS() NOT FOUND
// function removeNamedItemNS() NOT FOUND

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMCharacterData
 class DOMCharacterData extends DOMNode  {

// Constants

// Properties
public $data ;
public $length ;

// Methods
 //@php_DOMXML.xml#DOMCharacterData::substringData
	public function substringData( $offset , $count ){ }
 //@php_DOMXML.xml#DOMCharacterData::appendData
	public function appendData( $arg ){ }
 //@php_DOMXML.xml#DOMCharacterData::insertData
	public function insertData( $offset , $arg ){ }
 //@php_DOMXML.xml#DOMCharacterData::deleteData
	public function deleteData( $offset , $count ){ }
 //@php_DOMXML.xml#DOMCharacterData::replaceData
	public function replaceData( $offset , $count , $arg ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMAttr
 class DOMAttr extends DOMNode  {

// Constants

// Properties
public $name ;
public $ownerElement ;
public $schemaTypeInfo ;
public $specified ;
public $value ;
// Methods
private function __builtin_initializer(){ $this->ownerElement = new DOMElement();}
 //@php_DOMXML.xml#DOMAttr::isId
	public function isId(){ }
 //@php_DOMXML.xml#DOMAttr::__construct
	public function __construct( $name , $value ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMElement
 class DOMElement extends DOMNode  {

// Constants

// Properties
public $schemaTypeInfo ;
public $tagName ;

// Methods
 //@php_DOMXML.xml#DOMElement::getAttribute
	public function getAttribute( $name ){ }
 //@php_DOMXML.xml#DOMElement::setAttribute
	public function setAttribute( $name , $value ){ return new DOMAttr(); }
 //@php_DOMXML.xml#DOMElement::removeAttribute
	public function removeAttribute( $name ){ }
 //@php_DOMXML.xml#DOMElement::getAttributeNode
	public function getAttributeNode( $name ){ return new DOMAttr(); }
 //@php_DOMXML.xml#DOMElement::setAttributeNode
	public function setAttributeNode( DOMAttr $newAttr ){return new DOMAttr(); }
 //@php_DOMXML.xml#DOMElement::removeAttributeNode
	public function removeAttributeNode( DOMAttr $oldAttr ){ }
 //@php_DOMXML.xml#DOMElement::getElementsByTagName
	public function getElementsByTagName( $name ){return new DOMNodeList(); }
 //@php_DOMXML.xml#DOMElement::getAttributeNS
	public function getAttributeNS( $namespaceURI , $localName ){ }
 //@php_DOMXML.xml#DOMElement::setAttributeNS
	public function setAttributeNS( $namespaceURI , $qualifiedName , $value ){ return new DOMAttr(); }
 //@php_DOMXML.xml#DOMElement::removeAttributeNS
	public function removeAttributeNS( $namespaceURI , $localName ){ }
 //@php_DOMXML.xml#DOMElement::getAttributeNodeNS
	public function getAttributeNodeNS( $namespaceURI , $localName ){ return new DOMAttr();}
 //@php_DOMXML.xml#DOMElement::setAttributeNodeNS
	public function setAttributeNodeNS( DOMAttr $newAttr ){ return new DOMAttr(); }
 //@php_DOMXML.xml#DOMElement::getElementsByTagNameNS
	public function getElementsByTagNameNS( $namespaceURI , $localName ){ return new DOMNodeList(); }
 //@php_DOMXML.xml#DOMElement::hasAttribute
	public function hasAttribute( $name ){ }
 //@php_DOMXML.xml#DOMElement::hasAttributeNS
	public function hasAttributeNS( $namespaceURI , $localName ){ }
 //@php_DOMXML.xml#DOMElement::setIdAttribute
	public function setIdAttribute( $name , $isId ){ }
 //@php_DOMXML.xml#DOMElement::setIdAttributeNS
	public function setIdAttributeNS( $namespaceURI , $localName , $isId ){ }
 //@php_DOMXML.xml#DOMElement::setIdAttributeNode
	public function setIdAttributeNode( DOMAttr $attr , $isId ){ }
 //@php_DOMXML.xml#DOMElement::__construct
	public function __construct( $name , $value , $namespaceUri ){ }
}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMText
 class DOMText extends DOMCharacterData  {

// Constants

// Properties
public $wholeText ;
// Methods
 //@php_DOMXML.xml#DOMText::splitText
	public function splitText( $offset ){return new DOMText(); }
 //@php_DOMXML.xml#DOMText::isWhitespaceInElementContent
	public function isWhitespaceInElementContent(){ }
// function isElementContentWhitespace() NOT FOUND
// function replaceWholeText() NOT FOUND
 //@php_DOMXML.xml#DOMText::__construct
	public function __construct( $value ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMComment
 class DOMComment extends DOMCharacterData  {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#DOMComment::__construct
	public function __construct( $value ){ }

}

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMTypeinfo is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMUserDataHandler is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMDomError is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMErrorHandler is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMLocator is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMConfiguration is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMCdataSection is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMDocumentType
 class DOMDocumentType extends DOMNode  {

// Constants
public $publicId ;
public $systemId ;
public $name ;
public $entities ;
public $notations ;
public $internalSubset ;
// Properties

// Methods
private function __builtin_initializer(){ 
  $this->entities = new DOMNamedNodeMap();
  $this->notations = new DOMNamedNodeMap();
}

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMNotation
 class DOMNotation   {

// Constants

// Properties
public $publicId ;
public $systemId ;
// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMEntity
 class DOMEntity extends DOMNode  {

// Constants

// Properties
public  $publicId ;
public  $systemId ;
public  $notationName ;
public  $actualEncoding ;
public  $encoding ;
public  $version ;
// Methods

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMEntityReference
 class DOMEntityReference extends DOMNode  {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#DOMEntityReference::__construct
	public function __construct( $name ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMProcessingInstruction
 class DOMProcessingInstruction extends DOMNode  {

// Constants

// Properties
public $target ;
public $data ;
// Methods
 //@php_DOMXML.xml#DOMProcessingInstruction::__construct
	public function __construct( $name , $value ){ }

}

////////////////////////////////////////////////////////////////////////////////////

// WARNING: class DOMStringExtend is an internal/undocummented class; skipping....

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#DOMXPath
 class DOMXPath   {

// Constants

// Properties
public $document;
// Methods
 //@php_DOMXML.xml#DOMXPath::__construct
	public function __construct( DOMDocument $doc ){ $this->document = new DOMDocument(); }
 //@php_DOMXML.xml#DOMXPath::registerNamespace
	public function registerNamespace( $prefix , $uri ){ }
 //@php_DOMXML.xml#DOMXPath::query
	public function query( $expr , DOMNode $context ){ return new DOMNodeList(); }
 //@php_DOMXML.xml#DOMXPath::evaluate
	public function evaluate( $expr , DOMNode $context ){ return new DOMNodeList(); }

}

////////////////////////////////////////////////////////////////////////////////////

	define( 'XML_ELEMENT_NODE',1);
	define( 'XML_ATTRIBUTE_NODE',2);
	define( 'XML_TEXT_NODE',3);
	define( 'XML_CDATA_SECTION_NODE',4);
	define( 'XML_ENTITY_REF_NODE',5);
	define( 'XML_ENTITY_NODE',6);
	define( 'XML_PI_NODE',7);
	define( 'XML_COMMENT_NODE',8);
	define( 'XML_DOCUMENT_NODE',9);
	define( 'XML_DOCUMENT_TYPE_NODE',10);
	define( 'XML_DOCUMENT_FRAG_NODE',11);
	define( 'XML_NOTATION_NODE',12);
	define( 'XML_HTML_DOCUMENT_NODE',13);
	define( 'XML_DTD_NODE',14);
	define( 'XML_ELEMENT_DECL_NODE',15);
	define( 'XML_ATTRIBUTE_DECL_NODE',16);
	define( 'XML_ENTITY_DECL_NODE',17);
	define( 'XML_NAMESPACE_DECL_NODE',18);
	define( 'XML_LOCAL_NAMESPACE',18);
	define( 'XML_ATTRIBUTE_CDATA',1);
	define( 'XML_ATTRIBUTE_ID',2);
	define( 'XML_ATTRIBUTE_IDREF',3);
	define( 'XML_ATTRIBUTE_IDREFS',4);
	define( 'XML_ATTRIBUTE_ENTITY',6);
	define( 'XML_ATTRIBUTE_NMTOKEN',7);
	define( 'XML_ATTRIBUTE_NMTOKENS',8);
	define( 'XML_ATTRIBUTE_ENUMERATION',9);
	define( 'XML_ATTRIBUTE_NOTATION',10);
	define( 'DOM_PHP_ERR',0);
	define( 'DOM_INDEX_SIZE_ERR',1);
	define( 'DOMSTRING_SIZE_ERR',2);
	define( 'DOM_HIERARCHY_REQUEST_ERR',3);
	define( 'DOM_WRONG_DOCUMENT_ERR',4);
	define( 'DOM_INVALID_CHARACTER_ERR',5);
	define( 'DOM_NO_DATA_ALLOWED_ERR',6);
	define( 'DOM_NO_MODIFICATION_ALLOWED_ERR',7);
	define( 'DOM_NOT_FOUND_ERR',8);
	define( 'DOM_NOT_SUPPORTED_ERR',9);
	define( 'DOM_INUSE_ATTRIBUTE_ERR',10);
	define( 'DOM_INVALID_STATE_ERR',11);
	define( 'DOM_SYNTAX_ERR',12);
	define( 'DOM_INVALID_MODIFICATION_ERR',13);
	define( 'DOM_NAMESPACE_ERR',14);
	define( 'DOM_INVALID_ACCESS_ERR',15);
	define( 'DOM_VALIDATION_ERR',16);

/////////////////// ********** FUNCTIONS (1 total functions) ************ ///////////////////////////////

// 1: function dom_import_simplexml(); // prototype:dom_import_simplexml ( SimpleXMLElement $node )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension wddx

/////////////////// ********** FUNCTIONS (6 total functions) ************ ///////////////////////////////

// 1: function wddx_serialize_value(); // prototype:wddx_serialize_value ( mixed $var [, string $comment ] )
// 2: function wddx_serialize_vars(); // prototype:wddx_serialize_vars ( mixed $var_name [, mixed $... ] )
// 3: function wddx_packet_start(); // prototype:wddx_packet_start ([ string $comment ] )
// 4: function wddx_packet_end(); // prototype:wddx_packet_end ( resource $packet_id )
// 5: function wddx_add_vars(); // prototype:wddx_add_vars ( resource $packet_id , mixed $var_name [, mixed $... ] )
// 6: function wddx_deserialize(); // ALIAS of wddx_unserialize():wddx_deserialize(...)

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension xsl
//@php_DOMXML.xml#XSLTProcessor
 class XSLTProcessor   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#XSLTProcessor::importStylesheet
	public function importStylesheet( DOMDocument $doc ){ }
 //@php_DOMXML.xml#XSLTProcessor::transformToDoc
	public function transformToDoc( DOMNode $doc ){ return new DOMDocument(); }
 //@php_DOMXML.xml#XSLTProcessor::transformToUri
	public function transformToUri( DOMDocument $doc , $uri ){ }
 //@php_DOMXML.xml#XSLTProcessor::transformToXML
	public function transformToXml( DOMDocument $doc ){ }
 //@php_DOMXML.xml#XSLTProcessor::setParameter
	public function setParameter( $namespace , $name , $value ){ }
 //@php_DOMXML.xml#XSLTProcessor::getParameter
	public function getParameter( $namespace , $name ){ }
 //@php_DOMXML.xml#XSLTProcessor::removeParameter
	public function removeParameter( $namespace , $name ){ }
 //@php_DOMXML.xml#XSLTProcessor::hasExsltSupport
	public function hasExsltSupport(){ }
 //@php_DOMXML.xml#XSLTProcessor::registerPHPFunctions
	public function registerPHPFunctions( $restrict ){ }

}

////////////////////////////////////////////////////////////////////////////////////

	define( 'XSL_CLONE_AUTO',0);
	define( 'XSL_CLONE_NEVER',-1);
	define( 'XSL_CLONE_ALWAYS',1);
	define( 'LIBXSLT_VERSION',10123);
	define( 'LIBXSLT_DOTTED_VERSION','1.1.23');
	define( 'LIBEXSLT_VERSION',813);
	define( 'LIBEXSLT_DOTTED_VERSION','0.8.13');

/////////////////// ********** FUNCTIONS (0 total functions) ************ ///////////////////////////////


/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension xml
	define( 'XML_ERROR_NONE',0);
	define( 'XML_ERROR_NO_MEMORY',1);
	define( 'XML_ERROR_SYNTAX',2);
	define( 'XML_ERROR_NO_ELEMENTS',3);
	define( 'XML_ERROR_INVALID_TOKEN',4);
	define( 'XML_ERROR_UNCLOSED_TOKEN',5);
	define( 'XML_ERROR_PARTIAL_CHAR',6);
	define( 'XML_ERROR_TAG_MISMATCH',7);
	define( 'XML_ERROR_DUPLICATE_ATTRIBUTE',8);
	define( 'XML_ERROR_JUNK_AFTER_DOC_ELEMENT',9);
	define( 'XML_ERROR_PARAM_ENTITY_REF',10);
	define( 'XML_ERROR_UNDEFINED_ENTITY',11);
	define( 'XML_ERROR_RECURSIVE_ENTITY_REF',12);
	define( 'XML_ERROR_ASYNC_ENTITY',13);
	define( 'XML_ERROR_BAD_CHAR_REF',14);
	define( 'XML_ERROR_BINARY_ENTITY_REF',15);
	define( 'XML_ERROR_ATTRIBUTE_EXTERNAL_ENTITY_REF',16);
	define( 'XML_ERROR_MISPLACED_XML_PI',17);
	define( 'XML_ERROR_UNKNOWN_ENCODING',18);
	define( 'XML_ERROR_INCORRECT_ENCODING',19);
	define( 'XML_ERROR_UNCLOSED_CDATA_SECTION',20);
	define( 'XML_ERROR_EXTERNAL_ENTITY_HANDLING',21);
	define( 'XML_OPTION_CASE_FOLDING',1);
	define( 'XML_OPTION_TARGET_ENCODING',2);
	define( 'XML_OPTION_SKIP_TAGSTART',3);
	define( 'XML_OPTION_SKIP_WHITE',4);
	define( 'XML_SAX_IMPL','libxml');

/////////////////// ********** FUNCTIONS (24 total functions) ************ ///////////////////////////////

// 1: function xml_parser_create(); // prototype:xml_parser_create ([ string $encoding ] )
// 2: function xml_parser_create_ns(); // prototype:xml_parser_create_ns ([ string $encoding [, string $separator ]] )
// 3: function xml_set_object(); // prototype:xml_set_object ( resource $parser , object &amp;$object )
// 4: function xml_set_element_handler(); // prototype:xml_set_element_handler ( resource $parser , callback $start_element_handler , callback $end_element_handler )
// 5: function xml_set_character_data_handler(); // prototype:xml_set_character_data_handler ( resource $parser , callback $handler )
// 6: function xml_set_processing_instruction_handler(); // prototype:xml_set_processing_instruction_handler ( resource $parser , callback $handler )
// 7: function xml_set_default_handler(); // prototype:xml_set_default_handler ( resource $parser , callback $handler )
// 8: function xml_set_unparsed_entity_decl_handler(); // prototype:xml_set_unparsed_entity_decl_handler ( resource $parser , callback $handler )
// 9: function xml_set_notation_decl_handler(); // prototype:xml_set_notation_decl_handler ( resource $parser , callback $handler )
// 10: function xml_set_external_entity_ref_handler(); // prototype:xml_set_external_entity_ref_handler ( resource $parser , callback $handler )
// 11: function xml_set_start_namespace_decl_handler(); // prototype:xml_set_start_namespace_decl_handler ( resource $parser , callback $handler )
// 12: function xml_set_end_namespace_decl_handler(); // prototype:xml_set_end_namespace_decl_handler ( resource $parser , callback $handler )
// 13: function xml_parse(); // prototype:xml_parse ( resource $parser , string $data [, bool $is_final = false ] )
// 14: function xml_parse_into_struct(); // prototype:xml_parse_into_struct ( resource $parser , string $data , array &amp;$values [, array &amp;$index ] )
// 15: function xml_get_error_code(); // prototype:xml_get_error_code ( resource $parser )
// 16: function xml_error_string(); // prototype:xml_error_string ( int $code )
// 17: function xml_get_current_line_number(); // prototype:xml_get_current_line_number ( resource $parser )
// 18: function xml_get_current_column_number(); // prototype:xml_get_current_column_number ( resource $parser )
// 19: function xml_get_current_byte_index(); // prototype:xml_get_current_byte_index ( resource $parser )
// 20: function xml_parser_free(); // prototype:xml_parser_free ( resource $parser )
// 21: function xml_parser_set_option(); // prototype:xml_parser_set_option ( resource $parser , int $option , mixed $value )
// 22: function xml_parser_get_option(); // prototype:xml_parser_get_option ( resource $parser , int $option )
// 23: function utf8_encode(); // prototype:utf8_encode ( string $data )
// 24: function utf8_decode(); // prototype:utf8_decode ( string $data )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension simplexml
//@php_DOMXML.xml#SimpleXMLElement
 class SimpleXMLElement  /*implements Traversable*/ {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#SimpleXMLElement::__construct
	final public function __construct($data , $options, $data_is_url, $ns , $is_prefix){ }
 //@php_DOMXML.xml#SimpleXMLElement::asXML
	public function asXML($filename){ }
// function saveXML() NOT FOUND
 //@php_DOMXML.xml#SimpleXMLElement::xpath
	public function xpath($path){ return array();}
 //@php_DOMXML.xml#SimpleXMLElement::registerXPathNamespace
	public function registerXPathNamespace($prefix, $ns){ }
 //@php_DOMXML.xml#SimpleXMLElement::attributes
	public function attributes($ns, $is_prefix){ return new SimpleXMLElement();}
 //@php_DOMXML.xml#SimpleXMLElement::children
	public function children($ns, $is_prefix){ return new SimpleXMLElement();}
 //@php_DOMXML.xml#SimpleXMLElement::getNamespaces
	public function getNamespaces($recursive){ return array(); }
 //@php_DOMXML.xml#SimpleXMLElement::getDocNamespaces
	public function getDocNamespaces($recursive){ return array(); }
 //@php_DOMXML.xml#SimpleXMLElement::getName
	public function getName(){ }
 //@php_DOMXML.xml#SimpleXMLElement::addChild
	public function addChild($name, $value, $namespace){return new SimpleXMLElement(); }
 //@php_DOMXML.xml#SimpleXMLElement::addAttribute
	public function addAttribute($name, $value, $namespace){ }

}

////////////////////////////////////////////////////////////////////////////////////


/////////////////// ********** FUNCTIONS (3 total functions) ************ ///////////////////////////////

// 1: function simplexml_load_file(); // prototype:simplexml_load_file ( string $filename [, string $class_name = &quot;SimpleXMLElement&quot; [, int $options = 0 [, string $ns [, bool $is_prefix = false ]]]] )
// 2: function simplexml_load_string(); // prototype:simplexml_load_string ( string $data [, string $class_name = &quot;SimpleXMLElement&quot; [, int $options = 0 [, string $ns [, bool $is_prefix = false ]]]] )
// 3: function simplexml_import_dom(); // prototype:simplexml_import_dom ( DOMNode $node [, string $class_name = &quot;SimpleXMLElement&quot; ] )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
<?php //Extension soap
//@php_DOMXML.xml#SoapClient
 class SoapClient   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#SoapClient::SoapClient
	public function SoapClient($wsdl, array $options){ }
 //@php_DOMXML.xml#SoapClient::__call
	public function __call( $function_name , $arguments){ }
 //@php_DOMXML.xml#SoapClient::__soapCall
	public function __soapCall( $function_name , $arguments , $options , $input_headers , &$output_headers ){ }
 //@php_DOMXML.xml#SoapClient::__getLastRequest
	public function __getLastRequest(){ }
 //@php_DOMXML.xml#SoapClient::__getLastResponse
	public function __getLastResponse(){ }
 //@php_DOMXML.xml#SoapClient::__getLastRequestHeaders
	public function __getLastRequestHeaders(){ }
 //@php_DOMXML.xml#SoapClient::__getLastResponseHeaders
	public function __getLastResponseHeaders(){ }
 //@php_DOMXML.xml#SoapClient::__getFunctions
	public function __getFunctions(){ return array();}
 //@php_DOMXML.xml#SoapClient::__getTypes
	public function __getTypes(){ return array();}
 //@php_DOMXML.xml#SoapClient::__doRequest
	public function __doRequest($request, $location, $action, $version, $one_way){ }
 //@php_DOMXML.xml#SoapClient::__setCookie
	public function __setCookie($name, $value){ }
 //@php_DOMXML.xml#SoapClient::__setLocation
	public function __setLocation($new_location ){ }
 //@php_DOMXML.xml#SoapClient::__setSoapHeaders
	public function __setSoapHeaders($soap_headers){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#SoapVar
 class SoapVar   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#SoapVar::SoapVar
	public function __construct($data , $encoding ,$type_name , $type_namespace , $node_name ,$node_namespace ){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#SoapServer
 class SoapServer   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#SoapServer::SoapServer
	public function __construct($wsdl, array $options){ }
 //@php_DOMXML.xml#SoapServer::setPersistence
	public function setPersistence($mode){ }
 //@php_DOMXML.xml#SoapServer::setClass
	public function setClass($class_name, $args){ }
 //@php_DOMXML.xml#SoapServer::setObject
	public function setObject($object){ }
 //@php_DOMXML.xml#SoapServer::addFunction
	public function addFunction($functions){ }
 //@php_DOMXML.xml#SoapServer::getFunctions
	public function getFunctions(){ return array();}
 //@php_DOMXML.xml#SoapServer::handle
	public function handle($soap_request ){ }
 //@php_DOMXML.xml#SoapServer::fault
	public function fault( $code , $string , $actor , $details, $name){ }
 //@php_DOMXML.xml#SoapServer::addSoapHeader
	public function addSoapHeader($object){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#SoapFault
 class SoapFault extends Exception  {

// Constants

// Properties
	protected $message;
	protected $code;
	protected $file;
	protected $line;

// Methods
 //@php_DOMXML.xml#SoapFault::SoapFault
	public function __construct($faultcode , $faultstring , $faultactor , $detail , $faultname, $headerfault ){ }
 //@php_DOMXML.xml#SoapFault::__toString
	public function __toString(){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#SoapParam
 class SoapParam   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#SoapParam::SoapParam
	public function __construct($data,$name){ }

}

////////////////////////////////////////////////////////////////////////////////////

//@php_DOMXML.xml#SoapHeader
 class SoapHeader   {

// Constants

// Properties

// Methods
 //@php_DOMXML.xml#SoapHeader::SoapHeader
	public function __construct($namespace , $name , $data , $mustunderstand , $actor){ }

}

////////////////////////////////////////////////////////////////////////////////////

	define( 'SOAP_1_1',1);
	define( 'SOAP_1_2',2);
	define( 'SOAP_PERSISTENCE_SESSION',1);
	define( 'SOAP_PERSISTENCE_REQUEST',2);
	define( 'SOAP_FUNCTIONS_ALL',999);
	define( 'SOAP_ENCODED',1);
	define( 'SOAP_LITERAL',2);
	define( 'SOAP_RPC',1);
	define( 'SOAP_DOCUMENT',2);
	define( 'SOAP_ACTOR_NEXT',1);
	define( 'SOAP_ACTOR_NONE',2);
	define( 'SOAP_ACTOR_UNLIMATERECEIVER',3);
	define( 'SOAP_COMPRESSION_ACCEPT',32);
	define( 'SOAP_COMPRESSION_GZIP',0);
	define( 'SOAP_COMPRESSION_DEFLATE',16);
	define( 'SOAP_AUTHENTICATION_BASIC',0);
	define( 'SOAP_AUTHENTICATION_DIGEST',1);
	define( 'UNKNOWN_TYPE',999998);
	define( 'XSD_STRING',101);
	define( 'XSD_BOOLEAN',102);
	define( 'XSD_DECIMAL',103);
	define( 'XSD_FLOAT',104);
	define( 'XSD_DOUBLE',105);
	define( 'XSD_DURATION',106);
	define( 'XSD_DATETIME',107);
	define( 'XSD_TIME',108);
	define( 'XSD_DATE',109);
	define( 'XSD_GYEARMONTH',110);
	define( 'XSD_GYEAR',111);
	define( 'XSD_GMONTHDAY',112);
	define( 'XSD_GDAY',113);
	define( 'XSD_GMONTH',114);
	define( 'XSD_HEXBINARY',115);
	define( 'XSD_BASE64BINARY',116);
	define( 'XSD_ANYURI',117);
	define( 'XSD_QNAME',118);
	define( 'XSD_NOTATION',119);
	define( 'XSD_NORMALIZEDSTRING',120);
	define( 'XSD_TOKEN',121);
	define( 'XSD_LANGUAGE',122);
	define( 'XSD_NMTOKEN',123);
	define( 'XSD_NAME',124);
	define( 'XSD_NCNAME',125);
	define( 'XSD_ID',126);
	define( 'XSD_IDREF',127);
	define( 'XSD_IDREFS',128);
	define( 'XSD_ENTITY',129);
	define( 'XSD_ENTITIES',130);
	define( 'XSD_INTEGER',131);
	define( 'XSD_NONPOSITIVEINTEGER',132);
	define( 'XSD_NEGATIVEINTEGER',133);
	define( 'XSD_LONG',134);
	define( 'XSD_INT',135);
	define( 'XSD_SHORT',136);
	define( 'XSD_BYTE',137);
	define( 'XSD_NONNEGATIVEINTEGER',138);
	define( 'XSD_UNSIGNEDLONG',139);
	define( 'XSD_UNSIGNEDINT',140);
	define( 'XSD_UNSIGNEDSHORT',141);
	define( 'XSD_UNSIGNEDBYTE',142);
	define( 'XSD_POSITIVEINTEGER',143);
	define( 'XSD_NMTOKENS',144);
	define( 'XSD_ANYTYPE',145);
	define( 'XSD_ANYXML',147);
	define( 'APACHE_MAP',200);
	define( 'SOAP_ENC_OBJECT',301);
	define( 'SOAP_ENC_ARRAY',300);
	define( 'XSD_1999_TIMEINSTANT',401);
	define( 'XSD_NAMESPACE','http://www.w3.org/2001/XMLSchema');
	define( 'XSD_1999_NAMESPACE','http://www.w3.org/1999/XMLSchema');
	define( 'SOAP_SINGLE_ELEMENT_ARRAYS',1);
	define( 'SOAP_WAIT_ONE_WAY_CALLS',2);
	define( 'SOAP_USE_XSI_ARRAY_TYPE',4);
	define( 'WSDL_CACHE_NONE',0);
	define( 'WSDL_CACHE_DISK',1);
	define( 'WSDL_CACHE_MEMORY',2);
	define( 'WSDL_CACHE_BOTH',3);

/////////////////// ********** FUNCTIONS (2 total functions) ************ ///////////////////////////////

// 1: function use_soap_error_handler(); // prototype:use_soap_error_handler ([ bool $handler ] )
// 2: function is_soap_fault(); // prototype:is_soap_fault ( mixed $object )

/////////////////// ********** END_FUNCTIONS ************ ///////////////////////////////

?>
