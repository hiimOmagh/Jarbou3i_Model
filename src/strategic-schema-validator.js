/* Generated from schema/strategic-analysis.schema.json. Do not edit by hand. */
(function attachStrategicSchemaValidators(root) {
  "use strict";
  const module = { exports: {} };
  const exports = module.exports;
"use strict";
exports.canonical = validate20;
const schema31 = {"$schema":"https://json-schema.org/draft/2020-12/schema","$id":"https://hiimomagh.github.io/Jarbou3i_Model/schema/strategic-analysis.schema.json","title":"Jarbou3i Strategic Analysis Schema","description":"Versioned contract for the preserved Strategic engine. Biopolitical analyses use the independent biopolitical-training-map-v2 contract and schema.","type":"object","required":["schema_version","subject","interests","actors","tools","narrative","results","feedback","contradictions","scenarios"],"properties":{"schema_version":{"type":"string","pattern":"^1\\.1\\.0$"},"analysis_id":{"type":"string"},"generated_at":{"type":"string"},"language":{"enum":["ar","en","fr"]},"model_mode":{"enum":["simple","expert","research","focused"]},"analysis_lens":{"const":"strategic","default":"strategic","description":"Identifies the preserved Strategic engine."},"subject":{"type":"object","required":["title","context","question","executive_thesis"],"properties":{"title":{"type":"string"},"context":{"type":"string"},"question":{"type":"string"},"executive_thesis":{"type":"string"}}},"interests":{"type":"array","items":{"$ref":"#/$defs/interest"},"minItems":1},"actors":{"type":"array","items":{"$ref":"#/$defs/actor"},"minItems":1},"tools":{"type":"array","items":{"$ref":"#/$defs/tool"},"minItems":1},"narrative":{"type":"array","items":{"$ref":"#/$defs/narrative"},"minItems":1},"results":{"type":"array","items":{"$ref":"#/$defs/result"},"minItems":1},"feedback":{"type":"array","items":{"$ref":"#/$defs/feedback"},"minItems":1},"contradictions":{"type":"object","required":["items"],"properties":{"items":{"type":"array","items":{"$ref":"#/$defs/contradiction"},"minItems":1}}},"scenarios":{"type":"object","required":["items"],"properties":{"items":{"type":"array","items":{"$ref":"#/$defs/scenario"},"minItems":1}}},"evidence":{"type":"object","properties":{"items":{"type":"array","items":{"$ref":"#/$defs/evidence"},"minItems":1}}},"assumptions":{"type":"object","properties":{"items":{"type":"array","items":{"$ref":"#/$defs/assumption"},"minItems":0}}},"links":{"type":"array","items":{"$ref":"#/$defs/link"}},"quality_gate":{"type":"object"}},"$defs":{"score5":{"type":"number","minimum":1,"maximum":5},"confidence":{"enum":["high","medium","low"]},"base":{"type":"object","properties":{"id":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"},"rationale":{"type":"string"}},"required":["id"]},"interest":{"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","type","intensity","horizon","stakes"],"properties":{"name":{"type":"string"},"type":{"enum":["strategic","economic","political","ideological","health","security","productivity","fertility","migration","risk","education","labor","other"]},"intensity":{"$ref":"#/$defs/score5"},"horizon":{"enum":["short","medium","long"]},"stakes":{"enum":["marginal","important","existential"]}}}]},"actor":{"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","category","financial","decision_access","disruption_capacity","media_influence"],"properties":{"name":{"type":"string"},"category":{"type":"string","description":"Strategic actor category or biopolitical population/authority category."},"financial":{"$ref":"#/$defs/score5"},"decision_access":{"$ref":"#/$defs/score5"},"disruption_capacity":{"$ref":"#/$defs/score5"},"media_influence":{"$ref":"#/$defs/score5"}}}]},"tool":{"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","type","cost","risk","speed","reversibility","deniability"],"properties":{"name":{"type":"string"},"type":{"type":"string","description":"Strategic instrument or biopolitical governance technique."},"cost":{"$ref":"#/$defs/score5"},"risk":{"$ref":"#/$defs/score5"},"speed":{"$ref":"#/$defs/score5"},"reversibility":{"$ref":"#/$defs/score5"},"deniability":{"$ref":"#/$defs/score5"}}}]},"narrative":{"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","frame","coherence","media_alignment","public_acceptance"],"properties":{"name":{"type":"string"},"frame":{"type":"string","description":"Strategic legitimacy frame or biopolitical norm/subjectivation frame."},"coherence":{"$ref":"#/$defs/score5"},"media_alignment":{"$ref":"#/$defs/score5"},"public_acceptance":{"$ref":"#/$defs/score5"}}}]},"result":{"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","type","goal_achieved_pct","cost_benefit","power_balance_impact"],"properties":{"name":{"type":"string"},"type":{"type":"string","description":"Strategic result type or biopolitical embodied/social outcome type."},"goal_achieved_pct":{"type":"number","minimum":0,"maximum":100},"cost_benefit":{"$ref":"#/$defs/score5"},"power_balance_impact":{"type":"string"}}}]},"feedback":{"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","description","adapts","speed"],"properties":{"description":{"type":"string","description":"Strategic adaptation or biopolitical resistance/normalization feedback."},"adapts":{"type":"string"},"speed":{"enum":["fast","slow"]}}}]},"contradiction":{"type":"object","required":["id","rhetoric","actions","interpretation","severity"],"properties":{"id":{"type":"string"},"rhetoric":{"type":"string"},"contradiction_type":{"type":"string"},"actions":{"type":"array","items":{"type":"string"}},"affected_layers":{"type":"array","items":{"type":"string"}},"interpretation":{"type":"string"},"severity":{"type":"number","minimum":1,"maximum":10},"confidence":{"$ref":"#/$defs/confidence"}}},"scenario":{"type":"object","required":["id","name","probability","drivers","early_signals","disproven_if"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"probability":{"type":"number","minimum":0,"maximum":100},"timeframe":{"type":"string"},"drivers":{"type":"array","items":{"type":"string"}},"early_signals":{"type":"array","items":{"type":"string"}},"disproven_if":{"type":"array","items":{"type":"string"}},"rationale":{"type":"string"}}},"evidence":{"type":"object","required":["id","claim","basis","confidence","source_title","source_url","source_date","source_type","source_note","evidence_strength","uncertainty","counter_evidence"],"properties":{"id":{"type":"string"},"claim":{"type":"string"},"basis":{"enum":["observation","inference","estimate","source_based"]},"source_title":{"type":"string"},"source_url":{"type":"string"},"source_date":{"type":"string"},"source_type":{"type":"string"},"source_note":{"type":"string"},"evidence_strength":{"$ref":"#/$defs/score5"},"confidence":{"$ref":"#/$defs/confidence"},"uncertainty":{"type":"string"},"counter_evidence":{"type":"string"}}},"assumption":{"type":"object","required":["id","assumption","risk","disproving_test"],"properties":{"id":{"type":"string"},"assumption":{"type":"string"},"risk":{"enum":["low","medium","high"]},"disproving_test":{"type":"string"},"implication_if_wrong":{"type":"string"}}},"link":{"type":"object","required":["from","to","relation","strength"],"properties":{"from":{"type":"string"},"to":{"type":"string"},"relation":{"type":"string"},"strength":{"$ref":"#/$defs/score5"}}}}};
const schema56 = {"type":"object","required":["id","name","probability","drivers","early_signals","disproven_if"],"properties":{"id":{"type":"string"},"name":{"type":"string"},"probability":{"type":"number","minimum":0,"maximum":100},"timeframe":{"type":"string"},"drivers":{"type":"array","items":{"type":"string"}},"early_signals":{"type":"array","items":{"type":"string"}},"disproven_if":{"type":"array","items":{"type":"string"}},"rationale":{"type":"string"}}};
const schema60 = {"type":"object","required":["id","assumption","risk","disproving_test"],"properties":{"id":{"type":"string"},"assumption":{"type":"string"},"risk":{"enum":["low","medium","high"]},"disproving_test":{"type":"string"},"implication_if_wrong":{"type":"string"}}};
const pattern4 = new RegExp("^1\\.1\\.0$", "u");
const schema32 = {"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","type","intensity","horizon","stakes"],"properties":{"name":{"type":"string"},"type":{"enum":["strategic","economic","political","ideological","health","security","productivity","fertility","migration","risk","education","labor","other"]},"intensity":{"$ref":"#/$defs/score5"},"horizon":{"enum":["short","medium","long"]},"stakes":{"enum":["marginal","important","existential"]}}}]};
const schema35 = {"type":"number","minimum":1,"maximum":5};
const schema33 = {"type":"object","properties":{"id":{"type":"string"},"confidence":{"$ref":"#/$defs/confidence"},"rationale":{"type":"string"}},"required":["id"]};
const schema34 = {"enum":["high","medium","low"]};

function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate22.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err1 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
if(data.confidence !== undefined){
let data1 = data.confidence;
if(!(((data1 === "high") || (data1 === "medium")) || (data1 === "low"))){
const err2 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.rationale !== undefined){
if(typeof data.rationale !== "string"){
const err3 = {instancePath:instancePath+"/rationale",schemaPath:"#/properties/rationale/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
validate22.errors = vErrors;
return errors === 0;
}
validate22.evaluated = {"props":{"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};


function validate21(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate21.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.type === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.intensity === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "intensity"},message:"must have required property '"+"intensity"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.horizon === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "horizon"},message:"must have required property '"+"horizon"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.stakes === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "stakes"},message:"must have required property '"+"stakes"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err6 = {instancePath:instancePath+"/name",schemaPath:"#/allOf/1/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.type !== undefined){
let data1 = data.type;
if(!(((((((((((((data1 === "strategic") || (data1 === "economic")) || (data1 === "political")) || (data1 === "ideological")) || (data1 === "health")) || (data1 === "security")) || (data1 === "productivity")) || (data1 === "fertility")) || (data1 === "migration")) || (data1 === "risk")) || (data1 === "education")) || (data1 === "labor")) || (data1 === "other"))){
const err7 = {instancePath:instancePath+"/type",schemaPath:"#/allOf/1/properties/type/enum",keyword:"enum",params:{allowedValues: schema32.allOf[1].properties.type.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.intensity !== undefined){
let data2 = data.intensity;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 5 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/intensity",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2 < 1 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/intensity",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/intensity",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.horizon !== undefined){
let data3 = data.horizon;
if(!(((data3 === "short") || (data3 === "medium")) || (data3 === "long"))){
const err11 = {instancePath:instancePath+"/horizon",schemaPath:"#/allOf/1/properties/horizon/enum",keyword:"enum",params:{allowedValues: schema32.allOf[1].properties.horizon.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.stakes !== undefined){
let data4 = data.stakes;
if(!(((data4 === "marginal") || (data4 === "important")) || (data4 === "existential"))){
const err12 = {instancePath:instancePath+"/stakes",schemaPath:"#/allOf/1/properties/stakes/enum",keyword:"enum",params:{allowedValues: schema32.allOf[1].properties.stakes.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
validate21.errors = vErrors;
return errors === 0;
}
validate21.evaluated = {"props":{"name":true,"type":true,"intensity":true,"horizon":true,"stakes":true,"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};

const schema36 = {"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","category","financial","decision_access","disruption_capacity","media_influence"],"properties":{"name":{"type":"string"},"category":{"type":"string","description":"Strategic actor category or biopolitical population/authority category."},"financial":{"$ref":"#/$defs/score5"},"decision_access":{"$ref":"#/$defs/score5"},"disruption_capacity":{"$ref":"#/$defs/score5"},"media_influence":{"$ref":"#/$defs/score5"}}}]};

function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.category === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "category"},message:"must have required property '"+"category"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.financial === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "financial"},message:"must have required property '"+"financial"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.decision_access === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "decision_access"},message:"must have required property '"+"decision_access"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.disruption_capacity === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "disruption_capacity"},message:"must have required property '"+"disruption_capacity"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.media_influence === undefined){
const err6 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "media_influence"},message:"must have required property '"+"media_influence"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err7 = {instancePath:instancePath+"/name",schemaPath:"#/allOf/1/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.category !== undefined){
if(typeof data.category !== "string"){
const err8 = {instancePath:instancePath+"/category",schemaPath:"#/allOf/1/properties/category/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.financial !== undefined){
let data2 = data.financial;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 5 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/financial",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data2 < 1 || isNaN(data2)){
const err10 = {instancePath:instancePath+"/financial",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/financial",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.decision_access !== undefined){
let data3 = data.decision_access;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 5 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/decision_access",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(data3 < 1 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/decision_access",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/decision_access",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.disruption_capacity !== undefined){
let data4 = data.disruption_capacity;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 5 || isNaN(data4)){
const err15 = {instancePath:instancePath+"/disruption_capacity",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
if(data4 < 1 || isNaN(data4)){
const err16 = {instancePath:instancePath+"/disruption_capacity",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
else {
const err17 = {instancePath:instancePath+"/disruption_capacity",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.media_influence !== undefined){
let data5 = data.media_influence;
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 5 || isNaN(data5)){
const err18 = {instancePath:instancePath+"/media_influence",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data5 < 1 || isNaN(data5)){
const err19 = {instancePath:instancePath+"/media_influence",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
else {
const err20 = {instancePath:instancePath+"/media_influence",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
else {
const err21 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
validate25.errors = vErrors;
return errors === 0;
}
validate25.evaluated = {"props":{"name":true,"category":true,"financial":true,"decision_access":true,"disruption_capacity":true,"media_influence":true,"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};

const schema41 = {"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","type","cost","risk","speed","reversibility","deniability"],"properties":{"name":{"type":"string"},"type":{"type":"string","description":"Strategic instrument or biopolitical governance technique."},"cost":{"$ref":"#/$defs/score5"},"risk":{"$ref":"#/$defs/score5"},"speed":{"$ref":"#/$defs/score5"},"reversibility":{"$ref":"#/$defs/score5"},"deniability":{"$ref":"#/$defs/score5"}}}]};

function validate28(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate28.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.type === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.cost === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "cost"},message:"must have required property '"+"cost"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.risk === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "risk"},message:"must have required property '"+"risk"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.speed === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "speed"},message:"must have required property '"+"speed"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.reversibility === undefined){
const err6 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "reversibility"},message:"must have required property '"+"reversibility"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.deniability === undefined){
const err7 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "deniability"},message:"must have required property '"+"deniability"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err8 = {instancePath:instancePath+"/name",schemaPath:"#/allOf/1/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.type !== undefined){
if(typeof data.type !== "string"){
const err9 = {instancePath:instancePath+"/type",schemaPath:"#/allOf/1/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.cost !== undefined){
let data2 = data.cost;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 5 || isNaN(data2)){
const err10 = {instancePath:instancePath+"/cost",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data2 < 1 || isNaN(data2)){
const err11 = {instancePath:instancePath+"/cost",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/cost",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.risk !== undefined){
let data3 = data.risk;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 5 || isNaN(data3)){
const err13 = {instancePath:instancePath+"/risk",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data3 < 1 || isNaN(data3)){
const err14 = {instancePath:instancePath+"/risk",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/risk",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.speed !== undefined){
let data4 = data.speed;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 5 || isNaN(data4)){
const err16 = {instancePath:instancePath+"/speed",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(data4 < 1 || isNaN(data4)){
const err17 = {instancePath:instancePath+"/speed",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/speed",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.reversibility !== undefined){
let data5 = data.reversibility;
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 > 5 || isNaN(data5)){
const err19 = {instancePath:instancePath+"/reversibility",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data5 < 1 || isNaN(data5)){
const err20 = {instancePath:instancePath+"/reversibility",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
else {
const err21 = {instancePath:instancePath+"/reversibility",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.deniability !== undefined){
let data6 = data.deniability;
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 > 5 || isNaN(data6)){
const err22 = {instancePath:instancePath+"/deniability",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(data6 < 1 || isNaN(data6)){
const err23 = {instancePath:instancePath+"/deniability",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
else {
const err24 = {instancePath:instancePath+"/deniability",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
validate28.errors = vErrors;
return errors === 0;
}
validate28.evaluated = {"props":{"name":true,"type":true,"cost":true,"risk":true,"speed":true,"reversibility":true,"deniability":true,"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};

const schema47 = {"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","frame","coherence","media_alignment","public_acceptance"],"properties":{"name":{"type":"string"},"frame":{"type":"string","description":"Strategic legitimacy frame or biopolitical norm/subjectivation frame."},"coherence":{"$ref":"#/$defs/score5"},"media_alignment":{"$ref":"#/$defs/score5"},"public_acceptance":{"$ref":"#/$defs/score5"}}}]};

function validate31(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate31.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.frame === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "frame"},message:"must have required property '"+"frame"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.coherence === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "coherence"},message:"must have required property '"+"coherence"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.media_alignment === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "media_alignment"},message:"must have required property '"+"media_alignment"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.public_acceptance === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "public_acceptance"},message:"must have required property '"+"public_acceptance"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err6 = {instancePath:instancePath+"/name",schemaPath:"#/allOf/1/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.frame !== undefined){
if(typeof data.frame !== "string"){
const err7 = {instancePath:instancePath+"/frame",schemaPath:"#/allOf/1/properties/frame/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.coherence !== undefined){
let data2 = data.coherence;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 5 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/coherence",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2 < 1 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/coherence",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/coherence",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.media_alignment !== undefined){
let data3 = data.media_alignment;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 5 || isNaN(data3)){
const err11 = {instancePath:instancePath+"/media_alignment",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data3 < 1 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/media_alignment",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/media_alignment",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.public_acceptance !== undefined){
let data4 = data.public_acceptance;
if((typeof data4 == "number") && (isFinite(data4))){
if(data4 > 5 || isNaN(data4)){
const err14 = {instancePath:instancePath+"/public_acceptance",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(data4 < 1 || isNaN(data4)){
const err15 = {instancePath:instancePath+"/public_acceptance",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/public_acceptance",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
validate31.errors = vErrors;
return errors === 0;
}
validate31.evaluated = {"props":{"name":true,"frame":true,"coherence":true,"media_alignment":true,"public_acceptance":true,"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};

const schema51 = {"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","name","type","goal_achieved_pct","cost_benefit","power_balance_impact"],"properties":{"name":{"type":"string"},"type":{"type":"string","description":"Strategic result type or biopolitical embodied/social outcome type."},"goal_achieved_pct":{"type":"number","minimum":0,"maximum":100},"cost_benefit":{"$ref":"#/$defs/score5"},"power_balance_impact":{"type":"string"}}}]};

function validate34(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate34.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.name === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.type === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "type"},message:"must have required property '"+"type"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.goal_achieved_pct === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "goal_achieved_pct"},message:"must have required property '"+"goal_achieved_pct"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.cost_benefit === undefined){
const err4 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "cost_benefit"},message:"must have required property '"+"cost_benefit"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.power_balance_impact === undefined){
const err5 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "power_balance_impact"},message:"must have required property '"+"power_balance_impact"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.name !== undefined){
if(typeof data.name !== "string"){
const err6 = {instancePath:instancePath+"/name",schemaPath:"#/allOf/1/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.type !== undefined){
if(typeof data.type !== "string"){
const err7 = {instancePath:instancePath+"/type",schemaPath:"#/allOf/1/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.goal_achieved_pct !== undefined){
let data2 = data.goal_achieved_pct;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 > 100 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/goal_achieved_pct",schemaPath:"#/allOf/1/properties/goal_achieved_pct/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data2 < 0 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/goal_achieved_pct",schemaPath:"#/allOf/1/properties/goal_achieved_pct/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/goal_achieved_pct",schemaPath:"#/allOf/1/properties/goal_achieved_pct/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.cost_benefit !== undefined){
let data3 = data.cost_benefit;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 5 || isNaN(data3)){
const err11 = {instancePath:instancePath+"/cost_benefit",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data3 < 1 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/cost_benefit",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/cost_benefit",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.power_balance_impact !== undefined){
if(typeof data.power_balance_impact !== "string"){
const err14 = {instancePath:instancePath+"/power_balance_impact",schemaPath:"#/allOf/1/properties/power_balance_impact/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
}
else {
const err15 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
validate34.errors = vErrors;
return errors === 0;
}
validate34.evaluated = {"props":{"name":true,"type":true,"goal_achieved_pct":true,"cost_benefit":true,"power_balance_impact":true,"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};

const schema53 = {"allOf":[{"$ref":"#/$defs/base"},{"type":"object","required":["id","description","adapts","speed"],"properties":{"description":{"type":"string","description":"Strategic adaptation or biopolitical resistance/normalization feedback."},"adapts":{"type":"string"},"speed":{"enum":["fast","slow"]}}}]};

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate22(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.description === undefined){
const err1 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "description"},message:"must have required property '"+"description"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.adapts === undefined){
const err2 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "adapts"},message:"must have required property '"+"adapts"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.speed === undefined){
const err3 = {instancePath,schemaPath:"#/allOf/1/required",keyword:"required",params:{missingProperty: "speed"},message:"must have required property '"+"speed"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.description !== undefined){
if(typeof data.description !== "string"){
const err4 = {instancePath:instancePath+"/description",schemaPath:"#/allOf/1/properties/description/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.adapts !== undefined){
if(typeof data.adapts !== "string"){
const err5 = {instancePath:instancePath+"/adapts",schemaPath:"#/allOf/1/properties/adapts/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.speed !== undefined){
let data2 = data.speed;
if(!((data2 === "fast") || (data2 === "slow"))){
const err6 = {instancePath:instancePath+"/speed",schemaPath:"#/allOf/1/properties/speed/enum",keyword:"enum",params:{allowedValues: schema53.allOf[1].properties.speed.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"props":{"description":true,"adapts":true,"speed":true,"id":true,"confidence":true,"rationale":true},"dynamicProps":false,"dynamicItems":false};

const schema54 = {"type":"object","required":["id","rhetoric","actions","interpretation","severity"],"properties":{"id":{"type":"string"},"rhetoric":{"type":"string"},"contradiction_type":{"type":"string"},"actions":{"type":"array","items":{"type":"string"}},"affected_layers":{"type":"array","items":{"type":"string"}},"interpretation":{"type":"string"},"severity":{"type":"number","minimum":1,"maximum":10},"confidence":{"$ref":"#/$defs/confidence"}}};

function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate40.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.rhetoric === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "rhetoric"},message:"must have required property '"+"rhetoric"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.actions === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "actions"},message:"must have required property '"+"actions"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.interpretation === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "interpretation"},message:"must have required property '"+"interpretation"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.severity === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "severity"},message:"must have required property '"+"severity"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err5 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.rhetoric !== undefined){
if(typeof data.rhetoric !== "string"){
const err6 = {instancePath:instancePath+"/rhetoric",schemaPath:"#/properties/rhetoric/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.contradiction_type !== undefined){
if(typeof data.contradiction_type !== "string"){
const err7 = {instancePath:instancePath+"/contradiction_type",schemaPath:"#/properties/contradiction_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.actions !== undefined){
let data3 = data.actions;
if(Array.isArray(data3)){
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
if(typeof data3[i0] !== "string"){
const err8 = {instancePath:instancePath+"/actions/" + i0,schemaPath:"#/properties/actions/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
else {
const err9 = {instancePath:instancePath+"/actions",schemaPath:"#/properties/actions/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.affected_layers !== undefined){
let data5 = data.affected_layers;
if(Array.isArray(data5)){
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
if(typeof data5[i1] !== "string"){
const err10 = {instancePath:instancePath+"/affected_layers/" + i1,schemaPath:"#/properties/affected_layers/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath:instancePath+"/affected_layers",schemaPath:"#/properties/affected_layers/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.interpretation !== undefined){
if(typeof data.interpretation !== "string"){
const err12 = {instancePath:instancePath+"/interpretation",schemaPath:"#/properties/interpretation/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.severity !== undefined){
let data8 = data.severity;
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 10 || isNaN(data8)){
const err13 = {instancePath:instancePath+"/severity",schemaPath:"#/properties/severity/maximum",keyword:"maximum",params:{comparison: "<=", limit: 10},message:"must be <= 10"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(data8 < 1 || isNaN(data8)){
const err14 = {instancePath:instancePath+"/severity",schemaPath:"#/properties/severity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/severity",schemaPath:"#/properties/severity/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.confidence !== undefined){
let data9 = data.confidence;
if(!(((data9 === "high") || (data9 === "medium")) || (data9 === "low"))){
const err16 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
else {
const err17 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
validate40.errors = vErrors;
return errors === 0;
}
validate40.evaluated = {"props":{"id":true,"rhetoric":true,"contradiction_type":true,"actions":true,"affected_layers":true,"interpretation":true,"severity":true,"confidence":true},"dynamicProps":false,"dynamicItems":false};

const schema57 = {"type":"object","required":["id","claim","basis","confidence","source_title","source_url","source_date","source_type","source_note","evidence_strength","uncertainty","counter_evidence"],"properties":{"id":{"type":"string"},"claim":{"type":"string"},"basis":{"enum":["observation","inference","estimate","source_based"]},"source_title":{"type":"string"},"source_url":{"type":"string"},"source_date":{"type":"string"},"source_type":{"type":"string"},"source_note":{"type":"string"},"evidence_strength":{"$ref":"#/$defs/score5"},"confidence":{"$ref":"#/$defs/confidence"},"uncertainty":{"type":"string"},"counter_evidence":{"type":"string"}}};

function validate42(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate42.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.id === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.claim === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "claim"},message:"must have required property '"+"claim"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.basis === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "basis"},message:"must have required property '"+"basis"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.confidence === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "confidence"},message:"must have required property '"+"confidence"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.source_title === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_title"},message:"must have required property '"+"source_title"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.source_url === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_url"},message:"must have required property '"+"source_url"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.source_date === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_date"},message:"must have required property '"+"source_date"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.source_type === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_type"},message:"must have required property '"+"source_type"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.source_note === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "source_note"},message:"must have required property '"+"source_note"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.evidence_strength === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "evidence_strength"},message:"must have required property '"+"evidence_strength"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.uncertainty === undefined){
const err10 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "uncertainty"},message:"must have required property '"+"uncertainty"+"'"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(data.counter_evidence === undefined){
const err11 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "counter_evidence"},message:"must have required property '"+"counter_evidence"+"'"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(data.id !== undefined){
if(typeof data.id !== "string"){
const err12 = {instancePath:instancePath+"/id",schemaPath:"#/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.claim !== undefined){
if(typeof data.claim !== "string"){
const err13 = {instancePath:instancePath+"/claim",schemaPath:"#/properties/claim/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.basis !== undefined){
let data2 = data.basis;
if(!((((data2 === "observation") || (data2 === "inference")) || (data2 === "estimate")) || (data2 === "source_based"))){
const err14 = {instancePath:instancePath+"/basis",schemaPath:"#/properties/basis/enum",keyword:"enum",params:{allowedValues: schema57.properties.basis.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.source_title !== undefined){
if(typeof data.source_title !== "string"){
const err15 = {instancePath:instancePath+"/source_title",schemaPath:"#/properties/source_title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.source_url !== undefined){
if(typeof data.source_url !== "string"){
const err16 = {instancePath:instancePath+"/source_url",schemaPath:"#/properties/source_url/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.source_date !== undefined){
if(typeof data.source_date !== "string"){
const err17 = {instancePath:instancePath+"/source_date",schemaPath:"#/properties/source_date/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(data.source_type !== undefined){
if(typeof data.source_type !== "string"){
const err18 = {instancePath:instancePath+"/source_type",schemaPath:"#/properties/source_type/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.source_note !== undefined){
if(typeof data.source_note !== "string"){
const err19 = {instancePath:instancePath+"/source_note",schemaPath:"#/properties/source_note/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.evidence_strength !== undefined){
let data8 = data.evidence_strength;
if((typeof data8 == "number") && (isFinite(data8))){
if(data8 > 5 || isNaN(data8)){
const err20 = {instancePath:instancePath+"/evidence_strength",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data8 < 1 || isNaN(data8)){
const err21 = {instancePath:instancePath+"/evidence_strength",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
else {
const err22 = {instancePath:instancePath+"/evidence_strength",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data.confidence !== undefined){
let data9 = data.confidence;
if(!(((data9 === "high") || (data9 === "medium")) || (data9 === "low"))){
const err23 = {instancePath:instancePath+"/confidence",schemaPath:"#/$defs/confidence/enum",keyword:"enum",params:{allowedValues: schema34.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data.uncertainty !== undefined){
if(typeof data.uncertainty !== "string"){
const err24 = {instancePath:instancePath+"/uncertainty",schemaPath:"#/properties/uncertainty/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(data.counter_evidence !== undefined){
if(typeof data.counter_evidence !== "string"){
const err25 = {instancePath:instancePath+"/counter_evidence",schemaPath:"#/properties/counter_evidence/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
}
else {
const err26 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
validate42.errors = vErrors;
return errors === 0;
}
validate42.evaluated = {"props":{"id":true,"claim":true,"basis":true,"source_title":true,"source_url":true,"source_date":true,"source_type":true,"source_note":true,"evidence_strength":true,"confidence":true,"uncertainty":true,"counter_evidence":true},"dynamicProps":false,"dynamicItems":false};

const schema61 = {"type":"object","required":["from","to","relation","strength"],"properties":{"from":{"type":"string"},"to":{"type":"string"},"relation":{"type":"string"},"strength":{"$ref":"#/$defs/score5"}}};

function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate44.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.from === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "from"},message:"must have required property '"+"from"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.to === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "to"},message:"must have required property '"+"to"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.relation === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "relation"},message:"must have required property '"+"relation"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.strength === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "strength"},message:"must have required property '"+"strength"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.from !== undefined){
if(typeof data.from !== "string"){
const err4 = {instancePath:instancePath+"/from",schemaPath:"#/properties/from/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.to !== undefined){
if(typeof data.to !== "string"){
const err5 = {instancePath:instancePath+"/to",schemaPath:"#/properties/to/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.relation !== undefined){
if(typeof data.relation !== "string"){
const err6 = {instancePath:instancePath+"/relation",schemaPath:"#/properties/relation/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.strength !== undefined){
let data3 = data.strength;
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 > 5 || isNaN(data3)){
const err7 = {instancePath:instancePath+"/strength",schemaPath:"#/$defs/score5/maximum",keyword:"maximum",params:{comparison: "<=", limit: 5},message:"must be <= 5"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data3 < 1 || isNaN(data3)){
const err8 = {instancePath:instancePath+"/strength",schemaPath:"#/$defs/score5/minimum",keyword:"minimum",params:{comparison: ">=", limit: 1},message:"must be >= 1"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/strength",schemaPath:"#/$defs/score5/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
validate44.errors = vErrors;
return errors === 0;
}
validate44.evaluated = {"props":{"from":true,"to":true,"relation":true,"strength":true},"dynamicProps":false,"dynamicItems":false};


function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://hiimomagh.github.io/Jarbou3i_Model/schema/strategic-analysis.schema.json" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.schema_version === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "schema_version"},message:"must have required property '"+"schema_version"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.subject === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "subject"},message:"must have required property '"+"subject"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.interests === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "interests"},message:"must have required property '"+"interests"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.actors === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "actors"},message:"must have required property '"+"actors"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.tools === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "tools"},message:"must have required property '"+"tools"+"'"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.narrative === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "narrative"},message:"must have required property '"+"narrative"+"'"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.results === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "results"},message:"must have required property '"+"results"+"'"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.feedback === undefined){
const err7 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "feedback"},message:"must have required property '"+"feedback"+"'"};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(data.contradictions === undefined){
const err8 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "contradictions"},message:"must have required property '"+"contradictions"+"'"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(data.scenarios === undefined){
const err9 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "scenarios"},message:"must have required property '"+"scenarios"+"'"};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(data.schema_version !== undefined){
let data0 = data.schema_version;
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err10 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/pattern",keyword:"pattern",params:{pattern: "^1\\.1\\.0$"},message:"must match pattern \""+"^1\\.1\\.0$"+"\""};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/schema_version",schemaPath:"#/properties/schema_version/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.analysis_id !== undefined){
if(typeof data.analysis_id !== "string"){
const err12 = {instancePath:instancePath+"/analysis_id",schemaPath:"#/properties/analysis_id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.generated_at !== undefined){
if(typeof data.generated_at !== "string"){
const err13 = {instancePath:instancePath+"/generated_at",schemaPath:"#/properties/generated_at/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.language !== undefined){
let data3 = data.language;
if(!(((data3 === "ar") || (data3 === "en")) || (data3 === "fr"))){
const err14 = {instancePath:instancePath+"/language",schemaPath:"#/properties/language/enum",keyword:"enum",params:{allowedValues: schema31.properties.language.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.model_mode !== undefined){
let data4 = data.model_mode;
if(!((((data4 === "simple") || (data4 === "expert")) || (data4 === "research")) || (data4 === "focused"))){
const err15 = {instancePath:instancePath+"/model_mode",schemaPath:"#/properties/model_mode/enum",keyword:"enum",params:{allowedValues: schema31.properties.model_mode.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.analysis_lens !== undefined){
if("strategic" !== data.analysis_lens){
const err16 = {instancePath:instancePath+"/analysis_lens",schemaPath:"#/properties/analysis_lens/const",keyword:"const",params:{allowedValue: "strategic"},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.subject !== undefined){
let data6 = data.subject;
if(data6 && typeof data6 == "object" && !Array.isArray(data6)){
if(data6.title === undefined){
const err17 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "title"},message:"must have required property '"+"title"+"'"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(data6.context === undefined){
const err18 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "context"},message:"must have required property '"+"context"+"'"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(data6.question === undefined){
const err19 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "question"},message:"must have required property '"+"question"+"'"};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(data6.executive_thesis === undefined){
const err20 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/required",keyword:"required",params:{missingProperty: "executive_thesis"},message:"must have required property '"+"executive_thesis"+"'"};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if(data6.title !== undefined){
if(typeof data6.title !== "string"){
const err21 = {instancePath:instancePath+"/subject/title",schemaPath:"#/properties/subject/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data6.context !== undefined){
if(typeof data6.context !== "string"){
const err22 = {instancePath:instancePath+"/subject/context",schemaPath:"#/properties/subject/properties/context/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
if(data6.question !== undefined){
if(typeof data6.question !== "string"){
const err23 = {instancePath:instancePath+"/subject/question",schemaPath:"#/properties/subject/properties/question/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(data6.executive_thesis !== undefined){
if(typeof data6.executive_thesis !== "string"){
const err24 = {instancePath:instancePath+"/subject/executive_thesis",schemaPath:"#/properties/subject/properties/executive_thesis/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
else {
const err25 = {instancePath:instancePath+"/subject",schemaPath:"#/properties/subject/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.interests !== undefined){
let data11 = data.interests;
if(Array.isArray(data11)){
if(data11.length < 1){
const err26 = {instancePath:instancePath+"/interests",schemaPath:"#/properties/interests/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
const len0 = data11.length;
for(let i0=0; i0<len0; i0++){
if(!(validate21(data11[i0], {instancePath:instancePath+"/interests/" + i0,parentData:data11,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
}
}
else {
const err27 = {instancePath:instancePath+"/interests",schemaPath:"#/properties/interests/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(data.actors !== undefined){
let data13 = data.actors;
if(Array.isArray(data13)){
if(data13.length < 1){
const err28 = {instancePath:instancePath+"/actors",schemaPath:"#/properties/actors/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
const len1 = data13.length;
for(let i1=0; i1<len1; i1++){
if(!(validate25(data13[i1], {instancePath:instancePath+"/actors/" + i1,parentData:data13,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate25.errors : vErrors.concat(validate25.errors);
errors = vErrors.length;
}
}
}
else {
const err29 = {instancePath:instancePath+"/actors",schemaPath:"#/properties/actors/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
}
if(data.tools !== undefined){
let data15 = data.tools;
if(Array.isArray(data15)){
if(data15.length < 1){
const err30 = {instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
const len2 = data15.length;
for(let i2=0; i2<len2; i2++){
if(!(validate28(data15[i2], {instancePath:instancePath+"/tools/" + i2,parentData:data15,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate28.errors : vErrors.concat(validate28.errors);
errors = vErrors.length;
}
}
}
else {
const err31 = {instancePath:instancePath+"/tools",schemaPath:"#/properties/tools/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
}
if(data.narrative !== undefined){
let data17 = data.narrative;
if(Array.isArray(data17)){
if(data17.length < 1){
const err32 = {instancePath:instancePath+"/narrative",schemaPath:"#/properties/narrative/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
const len3 = data17.length;
for(let i3=0; i3<len3; i3++){
if(!(validate31(data17[i3], {instancePath:instancePath+"/narrative/" + i3,parentData:data17,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
errors = vErrors.length;
}
}
}
else {
const err33 = {instancePath:instancePath+"/narrative",schemaPath:"#/properties/narrative/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
if(data.results !== undefined){
let data19 = data.results;
if(Array.isArray(data19)){
if(data19.length < 1){
const err34 = {instancePath:instancePath+"/results",schemaPath:"#/properties/results/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
const len4 = data19.length;
for(let i4=0; i4<len4; i4++){
if(!(validate34(data19[i4], {instancePath:instancePath+"/results/" + i4,parentData:data19,parentDataProperty:i4,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate34.errors : vErrors.concat(validate34.errors);
errors = vErrors.length;
}
}
}
else {
const err35 = {instancePath:instancePath+"/results",schemaPath:"#/properties/results/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
if(data.feedback !== undefined){
let data21 = data.feedback;
if(Array.isArray(data21)){
if(data21.length < 1){
const err36 = {instancePath:instancePath+"/feedback",schemaPath:"#/properties/feedback/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
const len5 = data21.length;
for(let i5=0; i5<len5; i5++){
if(!(validate37(data21[i5], {instancePath:instancePath+"/feedback/" + i5,parentData:data21,parentDataProperty:i5,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
}
}
else {
const err37 = {instancePath:instancePath+"/feedback",schemaPath:"#/properties/feedback/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
if(data.contradictions !== undefined){
let data23 = data.contradictions;
if(data23 && typeof data23 == "object" && !Array.isArray(data23)){
if(data23.items === undefined){
const err38 = {instancePath:instancePath+"/contradictions",schemaPath:"#/properties/contradictions/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(data23.items !== undefined){
let data24 = data23.items;
if(Array.isArray(data24)){
if(data24.length < 1){
const err39 = {instancePath:instancePath+"/contradictions/items",schemaPath:"#/properties/contradictions/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
const len6 = data24.length;
for(let i6=0; i6<len6; i6++){
if(!(validate40(data24[i6], {instancePath:instancePath+"/contradictions/items/" + i6,parentData:data24,parentDataProperty:i6,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate40.errors : vErrors.concat(validate40.errors);
errors = vErrors.length;
}
}
}
else {
const err40 = {instancePath:instancePath+"/contradictions/items",schemaPath:"#/properties/contradictions/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
}
else {
const err41 = {instancePath:instancePath+"/contradictions",schemaPath:"#/properties/contradictions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
if(data.scenarios !== undefined){
let data26 = data.scenarios;
if(data26 && typeof data26 == "object" && !Array.isArray(data26)){
if(data26.items === undefined){
const err42 = {instancePath:instancePath+"/scenarios",schemaPath:"#/properties/scenarios/required",keyword:"required",params:{missingProperty: "items"},message:"must have required property '"+"items"+"'"};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(data26.items !== undefined){
let data27 = data26.items;
if(Array.isArray(data27)){
if(data27.length < 1){
const err43 = {instancePath:instancePath+"/scenarios/items",schemaPath:"#/properties/scenarios/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
const len7 = data27.length;
for(let i7=0; i7<len7; i7++){
let data28 = data27[i7];
if(data28 && typeof data28 == "object" && !Array.isArray(data28)){
if(data28.id === undefined){
const err44 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(data28.name === undefined){
const err45 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/required",keyword:"required",params:{missingProperty: "name"},message:"must have required property '"+"name"+"'"};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
if(data28.probability === undefined){
const err46 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/required",keyword:"required",params:{missingProperty: "probability"},message:"must have required property '"+"probability"+"'"};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(data28.drivers === undefined){
const err47 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/required",keyword:"required",params:{missingProperty: "drivers"},message:"must have required property '"+"drivers"+"'"};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
if(data28.early_signals === undefined){
const err48 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/required",keyword:"required",params:{missingProperty: "early_signals"},message:"must have required property '"+"early_signals"+"'"};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
if(data28.disproven_if === undefined){
const err49 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/required",keyword:"required",params:{missingProperty: "disproven_if"},message:"must have required property '"+"disproven_if"+"'"};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
if(data28.id !== undefined){
if(typeof data28.id !== "string"){
const err50 = {instancePath:instancePath+"/scenarios/items/" + i7+"/id",schemaPath:"#/$defs/scenario/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data28.name !== undefined){
if(typeof data28.name !== "string"){
const err51 = {instancePath:instancePath+"/scenarios/items/" + i7+"/name",schemaPath:"#/$defs/scenario/properties/name/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
}
if(data28.probability !== undefined){
let data31 = data28.probability;
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 > 100 || isNaN(data31)){
const err52 = {instancePath:instancePath+"/scenarios/items/" + i7+"/probability",schemaPath:"#/$defs/scenario/properties/probability/maximum",keyword:"maximum",params:{comparison: "<=", limit: 100},message:"must be <= 100"};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
if(data31 < 0 || isNaN(data31)){
const err53 = {instancePath:instancePath+"/scenarios/items/" + i7+"/probability",schemaPath:"#/$defs/scenario/properties/probability/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0},message:"must be >= 0"};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
}
else {
const err54 = {instancePath:instancePath+"/scenarios/items/" + i7+"/probability",schemaPath:"#/$defs/scenario/properties/probability/type",keyword:"type",params:{type: "number"},message:"must be number"};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
}
if(data28.timeframe !== undefined){
if(typeof data28.timeframe !== "string"){
const err55 = {instancePath:instancePath+"/scenarios/items/" + i7+"/timeframe",schemaPath:"#/$defs/scenario/properties/timeframe/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(data28.drivers !== undefined){
let data33 = data28.drivers;
if(Array.isArray(data33)){
const len8 = data33.length;
for(let i8=0; i8<len8; i8++){
if(typeof data33[i8] !== "string"){
const err56 = {instancePath:instancePath+"/scenarios/items/" + i7+"/drivers/" + i8,schemaPath:"#/$defs/scenario/properties/drivers/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
}
else {
const err57 = {instancePath:instancePath+"/scenarios/items/" + i7+"/drivers",schemaPath:"#/$defs/scenario/properties/drivers/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
}
if(data28.early_signals !== undefined){
let data35 = data28.early_signals;
if(Array.isArray(data35)){
const len9 = data35.length;
for(let i9=0; i9<len9; i9++){
if(typeof data35[i9] !== "string"){
const err58 = {instancePath:instancePath+"/scenarios/items/" + i7+"/early_signals/" + i9,schemaPath:"#/$defs/scenario/properties/early_signals/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
}
else {
const err59 = {instancePath:instancePath+"/scenarios/items/" + i7+"/early_signals",schemaPath:"#/$defs/scenario/properties/early_signals/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
}
if(data28.disproven_if !== undefined){
let data37 = data28.disproven_if;
if(Array.isArray(data37)){
const len10 = data37.length;
for(let i10=0; i10<len10; i10++){
if(typeof data37[i10] !== "string"){
const err60 = {instancePath:instancePath+"/scenarios/items/" + i7+"/disproven_if/" + i10,schemaPath:"#/$defs/scenario/properties/disproven_if/items/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
}
}
else {
const err61 = {instancePath:instancePath+"/scenarios/items/" + i7+"/disproven_if",schemaPath:"#/$defs/scenario/properties/disproven_if/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
}
if(data28.rationale !== undefined){
if(typeof data28.rationale !== "string"){
const err62 = {instancePath:instancePath+"/scenarios/items/" + i7+"/rationale",schemaPath:"#/$defs/scenario/properties/rationale/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
}
}
else {
const err63 = {instancePath:instancePath+"/scenarios/items/" + i7,schemaPath:"#/$defs/scenario/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
}
else {
const err64 = {instancePath:instancePath+"/scenarios/items",schemaPath:"#/properties/scenarios/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
}
else {
const err65 = {instancePath:instancePath+"/scenarios",schemaPath:"#/properties/scenarios/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
}
if(data.evidence !== undefined){
let data40 = data.evidence;
if(data40 && typeof data40 == "object" && !Array.isArray(data40)){
if(data40.items !== undefined){
let data41 = data40.items;
if(Array.isArray(data41)){
if(data41.length < 1){
const err66 = {instancePath:instancePath+"/evidence/items",schemaPath:"#/properties/evidence/properties/items/minItems",keyword:"minItems",params:{limit: 1},message:"must NOT have fewer than 1 items"};
if(vErrors === null){
vErrors = [err66];
}
else {
vErrors.push(err66);
}
errors++;
}
const len11 = data41.length;
for(let i11=0; i11<len11; i11++){
if(!(validate42(data41[i11], {instancePath:instancePath+"/evidence/items/" + i11,parentData:data41,parentDataProperty:i11,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate42.errors : vErrors.concat(validate42.errors);
errors = vErrors.length;
}
}
}
else {
const err67 = {instancePath:instancePath+"/evidence/items",schemaPath:"#/properties/evidence/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err67];
}
else {
vErrors.push(err67);
}
errors++;
}
}
}
else {
const err68 = {instancePath:instancePath+"/evidence",schemaPath:"#/properties/evidence/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err68];
}
else {
vErrors.push(err68);
}
errors++;
}
}
if(data.assumptions !== undefined){
let data43 = data.assumptions;
if(data43 && typeof data43 == "object" && !Array.isArray(data43)){
if(data43.items !== undefined){
let data44 = data43.items;
if(Array.isArray(data44)){
if(data44.length < 0){
const err69 = {instancePath:instancePath+"/assumptions/items",schemaPath:"#/properties/assumptions/properties/items/minItems",keyword:"minItems",params:{limit: 0},message:"must NOT have fewer than 0 items"};
if(vErrors === null){
vErrors = [err69];
}
else {
vErrors.push(err69);
}
errors++;
}
const len12 = data44.length;
for(let i12=0; i12<len12; i12++){
let data45 = data44[i12];
if(data45 && typeof data45 == "object" && !Array.isArray(data45)){
if(data45.id === undefined){
const err70 = {instancePath:instancePath+"/assumptions/items/" + i12,schemaPath:"#/$defs/assumption/required",keyword:"required",params:{missingProperty: "id"},message:"must have required property '"+"id"+"'"};
if(vErrors === null){
vErrors = [err70];
}
else {
vErrors.push(err70);
}
errors++;
}
if(data45.assumption === undefined){
const err71 = {instancePath:instancePath+"/assumptions/items/" + i12,schemaPath:"#/$defs/assumption/required",keyword:"required",params:{missingProperty: "assumption"},message:"must have required property '"+"assumption"+"'"};
if(vErrors === null){
vErrors = [err71];
}
else {
vErrors.push(err71);
}
errors++;
}
if(data45.risk === undefined){
const err72 = {instancePath:instancePath+"/assumptions/items/" + i12,schemaPath:"#/$defs/assumption/required",keyword:"required",params:{missingProperty: "risk"},message:"must have required property '"+"risk"+"'"};
if(vErrors === null){
vErrors = [err72];
}
else {
vErrors.push(err72);
}
errors++;
}
if(data45.disproving_test === undefined){
const err73 = {instancePath:instancePath+"/assumptions/items/" + i12,schemaPath:"#/$defs/assumption/required",keyword:"required",params:{missingProperty: "disproving_test"},message:"must have required property '"+"disproving_test"+"'"};
if(vErrors === null){
vErrors = [err73];
}
else {
vErrors.push(err73);
}
errors++;
}
if(data45.id !== undefined){
if(typeof data45.id !== "string"){
const err74 = {instancePath:instancePath+"/assumptions/items/" + i12+"/id",schemaPath:"#/$defs/assumption/properties/id/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err74];
}
else {
vErrors.push(err74);
}
errors++;
}
}
if(data45.assumption !== undefined){
if(typeof data45.assumption !== "string"){
const err75 = {instancePath:instancePath+"/assumptions/items/" + i12+"/assumption",schemaPath:"#/$defs/assumption/properties/assumption/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err75];
}
else {
vErrors.push(err75);
}
errors++;
}
}
if(data45.risk !== undefined){
let data48 = data45.risk;
if(!(((data48 === "low") || (data48 === "medium")) || (data48 === "high"))){
const err76 = {instancePath:instancePath+"/assumptions/items/" + i12+"/risk",schemaPath:"#/$defs/assumption/properties/risk/enum",keyword:"enum",params:{allowedValues: schema60.properties.risk.enum},message:"must be equal to one of the allowed values"};
if(vErrors === null){
vErrors = [err76];
}
else {
vErrors.push(err76);
}
errors++;
}
}
if(data45.disproving_test !== undefined){
if(typeof data45.disproving_test !== "string"){
const err77 = {instancePath:instancePath+"/assumptions/items/" + i12+"/disproving_test",schemaPath:"#/$defs/assumption/properties/disproving_test/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err77];
}
else {
vErrors.push(err77);
}
errors++;
}
}
if(data45.implication_if_wrong !== undefined){
if(typeof data45.implication_if_wrong !== "string"){
const err78 = {instancePath:instancePath+"/assumptions/items/" + i12+"/implication_if_wrong",schemaPath:"#/$defs/assumption/properties/implication_if_wrong/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err78];
}
else {
vErrors.push(err78);
}
errors++;
}
}
}
else {
const err79 = {instancePath:instancePath+"/assumptions/items/" + i12,schemaPath:"#/$defs/assumption/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err79];
}
else {
vErrors.push(err79);
}
errors++;
}
}
}
else {
const err80 = {instancePath:instancePath+"/assumptions/items",schemaPath:"#/properties/assumptions/properties/items/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err80];
}
else {
vErrors.push(err80);
}
errors++;
}
}
}
else {
const err81 = {instancePath:instancePath+"/assumptions",schemaPath:"#/properties/assumptions/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err81];
}
else {
vErrors.push(err81);
}
errors++;
}
}
if(data.links !== undefined){
let data51 = data.links;
if(Array.isArray(data51)){
const len13 = data51.length;
for(let i13=0; i13<len13; i13++){
if(!(validate44(data51[i13], {instancePath:instancePath+"/links/" + i13,parentData:data51,parentDataProperty:i13,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate44.errors : vErrors.concat(validate44.errors);
errors = vErrors.length;
}
}
}
else {
const err82 = {instancePath:instancePath+"/links",schemaPath:"#/properties/links/type",keyword:"type",params:{type: "array"},message:"must be array"};
if(vErrors === null){
vErrors = [err82];
}
else {
vErrors.push(err82);
}
errors++;
}
}
if(data.quality_gate !== undefined){
let data53 = data.quality_gate;
if(!(data53 && typeof data53 == "object" && !Array.isArray(data53))){
const err83 = {instancePath:instancePath+"/quality_gate",schemaPath:"#/properties/quality_gate/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err83];
}
else {
vErrors.push(err83);
}
errors++;
}
}
}
else {
const err84 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err84];
}
else {
vErrors.push(err84);
}
errors++;
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"props":{"schema_version":true,"analysis_id":true,"generated_at":true,"language":true,"model_mode":true,"analysis_lens":true,"subject":true,"interests":true,"actors":true,"tools":true,"narrative":true,"results":true,"feedback":true,"contradictions":true,"scenarios":true,"evidence":true,"assumptions":true,"links":true,"quality_gate":true},"dynamicProps":false,"dynamicItems":false};

  root.Jarbou3iStrategicSchemaValidators = Object.freeze(module.exports);
})(typeof window !== "undefined" ? window : globalThis);
