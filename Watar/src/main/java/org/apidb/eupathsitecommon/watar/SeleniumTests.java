package org.apidb.eupathsitecommon.watar;

//import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.Dimension;

import org.testng.annotations.Test;

import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.AfterTest;
import org.json.JSONArray;
import org.json.JSONObject;

//import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;

import java.io.BufferedReader;

import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Iterator;

import org.apidb.eupathsitecommon.watar.pages.HomePage;
import org.apidb.eupathsitecommon.watar.pages.SearchForm;
//import org.gusdb.fgputil.json.JsonIterators;
import org.apidb.eupathsitecommon.watar.pages.StaticContent;

public class SeleniumTests {
  private WebDriver driver;
  //private JavascriptExecutor js;

  private String baseurl;
  
//  private boolean isPortal;

  public SeleniumTests() {
    String websiteBase = "https://beta.trichdb.org"; //plasmodb.org";
    String webappName = "trichdb.beta"; // "plasmo.beta";

    //String websiteBase = System.getProperty("baseurl");
    //String webappName = System.getProperty("webappname");
    
    this.baseurl = websiteBase + "/" + webappName;
    
    //    isPortal = baseurl.toLowerCase().contains("eupathdb");
    
  }
  
  @BeforeTest
  public void setUp() {
   this.driver = new ChromeDriver();
   driver.manage().window().setSize(new Dimension(1000, 1000));
   //js = (JavascriptExecutor) driver;
  }
  @AfterTest
  public void tearDown() {
   driver.quit();
  }

  
  @DataProvider(name = "searches")
  public Iterator<Object[]> createSearches() {

    ArrayList<Object[]> searchesArrayList = new ArrayList<Object[]>();
    
    JSONObject recordTypesJson = parseEndpoint(baseurl + "/service/record-types", 1000, "record-types");
    JSONArray recordTypesArray = (JSONArray) recordTypesJson.get("record-types");

    for(int i = 0; i < recordTypesArray.length(); i++) {
      String recordType = recordTypesArray.getString(i);

      JSONObject searches = parseEndpoint(baseurl + "/service/record-types/" + recordType + "/searches", 1000, "searches");
      JSONArray searchesArray = (JSONArray) searches.get("searches");

      for(int j = 0; j < searchesArray.length(); j++) {
        JSONObject search = (JSONObject) searchesArray.get(j);
        String urlSegment = (String) search.get("urlSegment");
        String fullName = (String) search.get("fullName");
        JSONArray paramNames = (JSONArray) search.get("paramNames");

        if(urlSegment.equals("GenesByUserDatasetAntisense") || 
            urlSegment.equals("GenesByRNASeqUserDataset") || 
            urlSegment.equals("GenesByeQTL") ||
            urlSegment.equals("GenesFromTranscripts") ||
            urlSegment.equals("GenesByPlasmoDbDataset") ||
            urlSegment.contains("boolean_question")
            )
          continue;

        boolean hasParameters = paramNames.length() > 0;
        String queryPage = this.baseurl + "/app/search/" + recordType + "/" + urlSegment;

        Object[] sa = new Object[3];
        sa[0] = queryPage;
        sa[1] = fullName;
        sa[2] = hasParameters;

        searchesArrayList.add(sa);
      }

    }
    return searchesArrayList.iterator();
  }
  
  @Test(dataProvider = "searches")
  public void searchPage(String queryPage, String fullName, boolean hasParameters) {
    driver.get(queryPage);

    SearchForm searchForm = new SearchForm(driver, hasParameters);
    searchForm.waitForPageToLoad();

    assertTrue(!searchForm.containsError(), "Search form Contained Error: " + fullName);
  }



  @Test(description="Assert home page loads and the featured tool section is there.",
      groups = { "functional_tests" })
  public void homePage () {
    driver.get(this.baseurl);
    HomePage homePage = new HomePage(driver);
    homePage.waitForPageToLoad();
    assertTrue(homePage.selectedToolBodyCount() == 1, "assert Selected Tool Body was present");
    String initialSelectedToolText = homePage.selectedToolHeaderText();
    homePage.changeSelectedTool();
    String changedSelectedToolText = homePage.selectedToolHeaderText();
    assertTrue(!initialSelectedToolText.equals(changedSelectedToolText), "assert Selected Tool was Changed");
  }
  
 
  
  @DataProvider(name = "staticContent")
  public Iterator<Object[]> createStaticContent() {

    ArrayList<Object[]> staticArrayList = new ArrayList<Object[]>();

    Object[] sa = new Object[2];
    sa[0] =  this.baseurl + Utilities.NEWS_PATH; 
    sa[1] = "News page"; 
    
    staticArrayList.add(sa);
    return staticArrayList.iterator();
  }
  
  @Test(dataProvider = "staticContent")
  public void pageNews(String queryPage, String name) { 
    driver.get(queryPage);

    StaticContent searchForm = new StaticContent(driver);
    searchForm.waitForPageToLoad();
  }
  
 
  @DataProvider(name = "staticRSContent")
  public Iterator<Object[]> createStaticContent2() {

    ArrayList<Object[]> staticArrayList = new ArrayList<Object[]>();

    Object[] sa = new Object[2];
    sa[0] =  this.baseurl + Utilities.RELATED_SITES;
    sa[1] = "Related Sites page"; 
    
    staticArrayList.add(sa);
    return staticArrayList.iterator();
  }
  
  @Test(dataProvider = "staticRSContent")
  public void pageRelatedSites(String queryPage, String name) {
    driver.get(queryPage);

    StaticContent searchForm = new StaticContent(driver);
    searchForm.waitForPageToLoad();
  }

  

  @DataProvider(name = "staticPubContent")
  public Iterator<Object[]> createStaticContent3() {

    ArrayList<Object[]> staticArrayList = new ArrayList<Object[]>();

    Object[] sa = new Object[2];
    sa[0] =  this.baseurl + Utilities.PUBLICATIONS;
    sa[1] = "Publications page"; 
    
    staticArrayList.add(sa);
    return staticArrayList.iterator();
  }
  
  @Test(dataProvider = "staticPubContent")
  public void pagePublications(String queryPage, String name) {
    driver.get(queryPage);

    StaticContent searchForm = new StaticContent(driver);
    searchForm.waitForPageToLoad();
  }

 

  @DataProvider(name = "staticDSContent")
  public Iterator<Object[]> createStaticContent4() {

    ArrayList<Object[]> staticArrayList = new ArrayList<Object[]>();

    Object[] sa = new Object[2];
    sa[0] =  this.baseurl + Utilities.DATA_SUBMISSION;
    sa[1] = "Data Submission page"; 
    
    staticArrayList.add(sa);
    return staticArrayList.iterator();
  }
  
  @Test(dataProvider = "staticDSContent")
  public void pageDataSubmission(String queryPage, String name) {
    driver.get(queryPage);

    StaticContent searchForm = new StaticContent(driver);
    searchForm.waitForPageToLoad();
  }
  
 
 

  public static JSONObject parseEndpoint (String url, int timeout, String rootName)  {
      HttpURLConnection c = null;

      try {
          URL u = new URL(url);
          c = (HttpURLConnection) u.openConnection();
          c.setRequestMethod("GET");
          c.setRequestProperty("Content-length", "0");
          c.setUseCaches(false);
          c.setAllowUserInteraction(false);
          c.setConnectTimeout(timeout);
          c.setReadTimeout(timeout);
          c.connect();
          int status = c.getResponseCode();

          switch (status) {
              case 200:

                BufferedReader br = new BufferedReader(new InputStreamReader(c.getInputStream()));
                  StringBuilder sb = new StringBuilder();
                  String line;
                  while ((line = br.readLine()) != null) {
                      sb.append(line+"\n");
                  }
                  br.close();
                  return new JSONObject("{ \"" + rootName + "\":" + sb.toString() + "}");

          }
      } catch (Exception e) {
        e.printStackTrace();
      } finally {
         if (c != null) {
            try {
                c.disconnect();
            } catch (Exception ex) {

            }
         }
      }
      return null;
  }
  
}
